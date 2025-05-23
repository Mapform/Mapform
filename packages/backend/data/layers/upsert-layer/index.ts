"server-only";

import { db } from "@mapform/db";
import {
  layers,
  layersToPages,
  pointLayers,
  datasets,
  lineLayers,
  polygonLayers,
} from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { upsertLayerSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const upsertLayer = (authClient: UserAuthClient) =>
  authClient
    .schema(upsertLayerSchema)
    .action(
      async ({
        parsedInput: {
          id,
          datasetId,
          pageId,
          name,
          type,
          color,
          titleColumnId,
          descriptionColumnId,
          iconColumnId,
          pointProperties,
          lineProperties,
          polygonProperties,
        },
      }) => {
        // Get dataset columns to validate against
        const dataset = await db.query.datasets.findFirst({
          where: eq(datasets.id, datasetId),
          with: {
            columns: true,
          },
        });

        if (!dataset) {
          throw new Error("Dataset not found");
        }

        const columnTypes = new Map(
          dataset.columns.map((col) => [col.id, col.type]),
        );

        // Helper function to validate column IDs
        const validateColumnIds = (
          properties: {
            pointColumnId?: string | null;
            lineColumnId?: string | null;
            polygonColumnId?: string | null;
          },
          type: "point" | "line" | "polygon",
        ) => {
          const columnIds = dataset.columns.map((col) => col.id);

          // Validate point column if provided
          if (properties.pointColumnId) {
            if (!columnIds.includes(properties.pointColumnId)) {
              throw new Error(
                `${type} layer's point column ID does not belong to the dataset`,
              );
            }

            if (columnTypes.get(properties.pointColumnId) !== "point") {
              throw new Error(
                `${type} layer's point column must be of type 'point'`,
              );
            }
          }

          // Validate line column if provided
          if (properties.lineColumnId) {
            if (!columnIds.includes(properties.lineColumnId)) {
              throw new Error(
                `${type} layer's line column ID does not belong to the dataset`,
              );
            }

            if (columnTypes.get(properties.lineColumnId) !== "line") {
              throw new Error(
                `${type} layer's line column must be of type 'line'`,
              );
            }
          }

          // Validate polygon column if provided
          if (properties.polygonColumnId) {
            if (!columnIds.includes(properties.polygonColumnId)) {
              throw new Error(
                `${type} layer's polygon column ID does not belong to the dataset`,
              );
            }

            if (columnTypes.get(properties.polygonColumnId) !== "polygon") {
              throw new Error(
                `${type} layer's polygon column must be of type 'polygon'`,
              );
            }
          }
        };

        // Validate properties before upserting
        if (type === "point" && pointProperties) {
          validateColumnIds(pointProperties, "point");
        }

        if (type === "line" && lineProperties) {
          validateColumnIds(lineProperties, "line");
        }

        if (type === "polygon" && polygonProperties) {
          validateColumnIds(polygonProperties, "polygon");
        }

        if (titleColumnId && columnTypes.get(titleColumnId) !== "string") {
          throw new Error(
            `${type} layer's title column must be of type 'string'`,
          );
        }

        if (
          descriptionColumnId &&
          columnTypes.get(descriptionColumnId) !== "richtext"
        ) {
          throw new Error(
            `${type} layer's description column must be of type 'richtext'`,
          );
        }

        if (iconColumnId && columnTypes.get(iconColumnId) !== "icon") {
          throw new Error(`${type} layer's icon column must be of type 'icon'`);
        }

        const newLayer = await db.transaction(async (tx) => {
          const shouldUpdate = !!id;

          const [layer] = await tx
            .insert(layers)
            .values({
              id,
              datasetId,
              name,
              type,
              color,
              titleColumnId,
              descriptionColumnId,
              iconColumnId,
            })
            .onConflictDoUpdate({
              target: layers.id,
              set: {
                datasetId,
                name,
                type,
                color,
                titleColumnId,
                descriptionColumnId,
                iconColumnId,
              },
            })
            .returning();

          if (!layer) {
            throw new Error("Failed to create layer");
          }

          /**
           * Only insert when creating layer
           */
          if (!shouldUpdate) {
            const existingPageLayers = await tx.query.layersToPages.findMany({
              where: eq(layersToPages.pageId, pageId),
            });

            await tx
              .insert(layersToPages)
              .values({
                layerId: layer.id,
                pageId,
                position: existingPageLayers.length + 1,
              })
              .returning();
          }

          if (type === "point" && pointProperties) {
            await tx
              .insert(pointLayers)
              .values({
                layerId: layer.id,
                ...pointProperties,
              })
              .onConflictDoUpdate({
                target: pointLayers.layerId,
                set: pointProperties,
              });
          }

          if (type === "line" && lineProperties) {
            await tx
              .insert(lineLayers)
              .values({
                layerId: layer.id,
                ...lineProperties,
              })
              .onConflictDoUpdate({
                target: lineLayers.layerId,
                set: lineProperties,
              });
          }

          if (type === "polygon" && polygonProperties) {
            await tx
              .insert(polygonLayers)
              .values({
                layerId: layer.id,
                ...polygonProperties,
              })
              .onConflictDoUpdate({
                target: polygonLayers.layerId,
                set: polygonProperties,
              });
          }

          return layer;
        });
        return newLayer;
      },
    );
