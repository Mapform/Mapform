import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { layersToPages } from "@mapform/db/schema";
import type { CreatePageLayerSchema } from "./schema";

export const createPageLayer = async ({
  layerId,
  pageId,
}: CreatePageLayerSchema) => {
  const existingPageLayers = await db.query.layersToPages.findMany({
    where: eq(layersToPages.layerId, layerId),
  });

  await db
    .insert(layersToPages)
    .values({
      layerId,
      pageId,
      position: existingPageLayers.length + 1,
    })
    .returning();
};
