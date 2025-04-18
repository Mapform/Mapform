"server-only";

import { db } from "@mapform/db";
import {
  layers,
  layersToPages,
  markerLayers,
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
          pointProperties,
          markerProperties,
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

        // Helper function to validate column IDs
        const validateColumnIds = (
          properties: {
            pointColumnId?: string | null;
            titleColumnId?: string | null;
            descriptionColumnId?: string | null;
            iconColumnId?: string | null;
            lineColumnId?: string | null;
            polygonColumnId?: string | null;
          },
          type: "point" | "marker" | "line" | "polygon",
        ) => {
          // If no point column is provided, skip validation
          if (!properties.pointColumnId) {
            return;
          }

          const columnIds = dataset.columns.map((col) => col.id);
          const columnTypes = new Map(
            dataset.columns.map((col) => [col.id, col.type]),
          );

          // Point column must be of type 'point' if provided
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

          // Optional columns must exist in dataset if provided
          if (
            properties.titleColumnId &&
            !columnIds.includes(properties.titleColumnId)
          ) {
            throw new Error(
              `${type} layer's title column ID does not belong to the dataset`,
            );
          }
          if (
            properties.descriptionColumnId &&
            !columnIds.includes(properties.descriptionColumnId)
          ) {
            throw new Error(
              `${type} layer's description column ID does not belong to the dataset`,
            );
          }
          if (
            properties.iconColumnId &&
            !columnIds.includes(properties.iconColumnId)
          ) {
            throw new Error(
              `${type} layer's icon column ID does not belong to the dataset`,
            );
          }

          // Validate column types if provided
          if (
            properties.titleColumnId &&
            columnTypes.get(properties.titleColumnId) !== "string"
          ) {
            throw new Error(
              `${type} layer's title column must be of type 'string'`,
            );
          }
          if (
            properties.descriptionColumnId &&
            columnTypes.get(properties.descriptionColumnId) !== "richtext"
          ) {
            throw new Error(
              `${type} layer's description column must be of type 'richtext'`,
            );
          }
          if (
            properties.iconColumnId &&
            columnTypes.get(properties.iconColumnId) !== "icon"
          ) {
            throw new Error(
              `${type} layer's icon column must be of type 'icon'`,
            );
          }
        };

        // Validate properties before upserting
        if (type === "point" && pointProperties) {
          validateColumnIds(pointProperties, "point");
        }

        if (type === "marker" && markerProperties) {
          validateColumnIds(markerProperties, "marker");
        }

        if (type === "line" && lineProperties) {
          validateColumnIds(lineProperties, "line");
        }

        if (type === "polygon" && polygonProperties) {
          validateColumnIds(polygonProperties, "polygon");
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
            })
            .onConflictDoUpdate({
              target: layers.id,
              set: { datasetId, name, type },
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

          if (type === "marker" && markerProperties) {
            await tx
              .insert(markerLayers)
              .values({
                layerId: layer.id,
                ...markerProperties,
              })
              .onConflictDoUpdate({
                target: markerLayers.layerId,
                set: markerProperties,
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
