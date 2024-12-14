"server-only";

import { db } from "@mapform/db";
import { v4 as uuidv4 } from "uuid";
import { isEqual, uniqWith } from "@mapform/lib/lodash";
import { eq, and, isNull, inArray } from "@mapform/db/utils";
import {
  layers,
  layersToPages,
  pages,
  pointLayers,
  projects,
} from "@mapform/db/schema";
import { publishProjectSchema } from "./schema";
import { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const publishProject = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(publishProjectSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { userAccess } }) => {
      const [rootProjectResponse, results] = await Promise.all([
        db.query.projects.findFirst({
          where: and(
            eq(projects.id, projectId),
            isNull(projects.rootProjectId),
            inArray(projects.teamspaceId, userAccess.teamspace.ids),
          ),
        }),

        db
          .select()
          .from(pages)
          .leftJoin(layersToPages, eq(pages.id, layersToPages.pageId))
          .leftJoin(layers, eq(layers.id, layersToPages.layerId))
          .leftJoin(pointLayers, eq(layers.id, pointLayers.layerId))
          .where(eq(pages.projectId, projectId)),
      ]);

      if (!rootProjectResponse) {
        throw new Error("Project not found");
      }

      const aggregatePages = uniqWith(
        results.map((result) => result.page),
        isEqual,
      );
      const aggregateLayersToPages = uniqWith(
        results.map((result) => result.layers_to_pages).filter(notEmpty),
        isEqual,
      );
      const aggregateLayers = uniqWith(
        results.map((result) => result.layer).filter(notEmpty),
        isEqual,
      );
      const aggregatePointLayers = uniqWith(
        results.map((result) => result.point_layer).filter(notEmpty),
        isEqual,
      );

      /**
       * Generate UUIDs for all the records we're going to create. This will allow
       * us to create the relationships between the new records.
       */
      const rootProjectWithIds = {
        ...rootProjectResponse,
        pages: aggregatePages
          .map((page) => ({
            ...page,
            newId: uuidv4(),
            layersToPages: aggregateLayersToPages
              .filter((ltp) => ltp.pageId === page.id)
              .map((ltp2) => {
                const layer = aggregateLayers.find(
                  (l) => l.id === ltp2.layerId,
                );
                const pointLayer = aggregatePointLayers.find(
                  (pl) => pl.layerId === ltp2.layerId,
                );

                return {
                  ...ltp2,
                  layer: layer
                    ? {
                        ...layer,
                        newId: uuidv4(),
                        pointLayer: pointLayer
                          ? {
                              ...pointLayer,
                              newId: uuidv4(),
                            }
                          : undefined,
                      }
                    : undefined,
                };
              })
              .filter(notEmpty),
          }))
          .filter(notEmpty),
      };

      /**
       * Create a new project version from the root
       */
      await db.transaction(async (tx) => {
        /**
         * Copy the project
         */
        const {
          id: _1,
          createdAt: _2,
          updatedAt: _3,
          ...copyFields
        } = rootProjectWithIds;
        const [newPublishedProject] = await db
          .insert(projects)
          .values({
            ...copyFields,
            isDirty: false,
            rootProjectId: rootProjectWithIds.id,
            datasetId: rootProjectWithIds.datasetId,
          })
          .returning();

        if (!newPublishedProject) {
          throw new Error("Failed to create new project");
        }

        /**
         * Copy the pages
         */
        const [newPages] = await Promise.all(
          rootProjectWithIds.pages.map((page) => {
            const {
              id: _4,
              createdAt: _5,
              updatedAt: _6,
              ...copyPageFields
            } = page;

            return tx
              .insert(pages)
              .values({
                ...copyPageFields,
                id: page.newId,
                projectId: newPublishedProject.id,
              })
              .returning();
          }),
        );

        if (!newPages) {
          throw new Error("Failed to create new pages");
        }

        /**
         * Copy the layersToPages, layers and sub-layers (eg. point layers)
         */
        const layersFlat = rootProjectWithIds.pages
          .map((page) =>
            page.layersToPages.map((layerToPage) => layerToPage.layer),
          )
          .flat()
          .filter(notEmpty);

        await Promise.all([
          /**
           * Create the layers
           */
          ...layersFlat.map((layer) => {
            const {
              id: _7,
              createdAt: _8,
              updatedAt: _9,
              pointLayer: _10,
              ...copyLayerFields
            } = layer;

            return tx
              .insert(layers)
              .values({
                ...copyLayerFields,
                id: layer.newId,
              })
              .returning();
          }),

          /**
           * Create the layersToPages
           */
          ...rootProjectWithIds.pages
            .map((page) =>
              page.layersToPages.map((layerToPage) => {
                if (!layerToPage.layer) {
                  return;
                }

                return tx.insert(layersToPages).values({
                  pageId: page.newId,
                  layerId: layerToPage.layer.newId,
                  position: layerToPage.position,
                });
              }),
            )
            .flat(),

          /**
           * Create the point layers
           */
          ...layersFlat
            .filter((layer) => layer.pointLayer)
            .map((layer) => {
              const { id: _11, ...copyPointLayerFields } = layer.pointLayer!;

              return tx
                .insert(pointLayers)
                .values({
                  ...copyPointLayerFields,
                  id: layer.pointLayer!.newId,
                  layerId: layer.newId,
                })
                .returning();
            }),

          /**
           * Set the isDirty flag to false
           */
          tx
            .update(projects)
            .set({
              isDirty: false,
            })
            .where(eq(projects.id, rootProjectWithIds.id)),
        ]);
      });
    });

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
