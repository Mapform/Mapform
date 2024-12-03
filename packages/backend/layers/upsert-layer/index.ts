import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  layers,
  layersToPages,
  markerLayers,
  pointLayers,
} from "@mapform/db/schema";
import type { UpsertLayerSchema } from "./schema";

export const upsertLayer = async ({
  id,
  datasetId,
  pageId,
  name,
  type,
  pointProperties,
  markerProperties,
}: UpsertLayerSchema) => {
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

    return layer;
  });

  return newLayer;
};
