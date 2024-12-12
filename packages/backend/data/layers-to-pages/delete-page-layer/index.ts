"use server";

import { db } from "@mapform/db";
import { eq, and, gt, sql } from "@mapform/db/utils";
import { layersToPages } from "@mapform/db/schema";
import type { DeletePageLayerSchema } from "./schema";

export const deletePageLayer = async ({
  layerId,
  pageId,
}: DeletePageLayerSchema) => {
  const existingPageLayers = await db.query.layersToPages.findMany({
    where: eq(layersToPages.layerId, layerId),
  });

  await db.transaction(async (tx) => {
    await tx
      .delete(layersToPages)
      .where(
        and(
          eq(layersToPages.layerId, layerId),
          eq(layersToPages.pageId, pageId),
        ),
      );

    // We now need to update the position of the remaining layersToPosition
    await Promise.all(
      existingPageLayers.map(async (ltp) => {
        const positionThatWasDeleted = ltp.position;

        return db
          .update(layersToPages)
          .set({
            position: sql`${layersToPages.position} - 1`,
          })
          .where(
            and(
              eq(layersToPages.pageId, pageId),
              gt(layersToPages.position, positionThatWasDeleted),
            ),
          );
      }),
    );
  });
};
