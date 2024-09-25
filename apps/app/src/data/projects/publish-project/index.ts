"use server";

import { v4 as uuidv4 } from "uuid";
import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq, and, isNull } from "@mapform/db/utils";
import {
  layers,
  layersToPages,
  pages,
  pointLayers,
  projects,
} from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { publishProjectSchema } from "./schema";

/**
 * When we publish, we always create a new form version. By keeping track of
 * version history, we can allow users to revert to previous versions, and we
 * can show more detailed submission results.
 */
export const publishProject = authAction
  .schema(publishProjectSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    const [rootProjectResponse, projectPages] = await Promise.all([
      await db.query.projects.findFirst({
        where: and(eq(projects.id, projectId), isNull(projects.rootProjectId)),
      }),

      await db.query.pages.findMany({
        where: eq(pages.projectId, projectId),
        with: {
          layersToPages: {
            with: {
              layer: {
                with: {
                  pointLayer: true,
                },
              },
            },
          },
        },
      }),
    ]);

    if (!rootProjectResponse) {
      throw new Error("Project not found");
    }

    const rootProject = {
      ...rootProjectResponse,
      pages: projectPages,
    };

    /**
     * Generate UUIDs for all the records we're going to create. This will allow
     * us to create the relationships between the new records.
     */
    const rootProjectWithIds = {
      ...rootProject,
      pages: rootProject.pages.map((page) => ({
        ...page,
        newId: uuidv4(),
        layersToPages: page.layersToPages.map((layerToPage) => ({
          ...layerToPage,
          layer: {
            ...layerToPage.layer,
            newId: uuidv4(),
            pointLayer: layerToPage.layer.pointLayer
              ? {
                  ...layerToPage.layer.pointLayer,
                  newId: uuidv4(),
                }
              : undefined,
          },
        })),
      })),
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
      } = rootProject;
      const [newPublishedProject] = await db
        .insert(projects)
        .values({
          ...copyFields,
          isDirty: false,
          rootProjectId: rootProject.id,
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
        })
      );

      if (!newPages) {
        throw new Error("Failed to create new pages");
      }

      /**
       * Copy the layersToPages, layers and sub-layers (eg. point layers)
       */
      const layersFlat = rootProjectWithIds.pages
        .map((page) =>
          page.layersToPages.map((layerToPage) => layerToPage.layer)
        )
        .flat();
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
              return tx.insert(layersToPages).values({
                pageId: page.newId,
                layerId: layerToPage.layer.newId,
                position: layerToPage.position,
              });
            })
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
          .where(eq(projects.id, rootProject.id)),
      ]);
    });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
