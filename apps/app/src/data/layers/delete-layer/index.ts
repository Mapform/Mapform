"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq, and, gt, sql } from "@mapform/db/utils";
import { layers, layersToPages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { deleteLayerSchema } from "./schema";

export const deleteLayer = authAction
  .schema(deleteLayerSchema)
  .action(async ({ parsedInput: { layerId } }) => {
    const existingPageLayers = await db.query.layersToPages.findMany({
      where: eq(layersToPages.layerId, layerId),
    });

    await db.transaction(async (tx) => {
      await tx.delete(layersToPages).where(eq(layersToPages.layerId, layerId));
      await tx.delete(layers).where(eq(layers.id, layerId));

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
                eq(layersToPages.pageId, ltp.pageId),
                gt(layersToPages.position, positionThatWasDeleted)
              )
            );
        })
      );
    });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
