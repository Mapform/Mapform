"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { layers, layersToPages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { deleteLayerSchema } from "./schema";

export const deleteLayer = authAction
  .schema(deleteLayerSchema)
  .action(async ({ parsedInput: { layerId } }) => {
    const existingLayersToPages = await db.query.layersToPages.findMany({
      where: eq(layersToPages.layerId, layerId),
    });

    await db.transaction(async (tx) => {
      await tx.delete(layers).where(eq(layers.id, layerId));

      // We now need to update the position of the remaining layersToPosition
      await Promise.all(
        existingLayersToPages.map(async (ltp) => {
          const positionThatWasDeleted = ltp.position;

          return db.update(layersToPages).set({
            position: positionThatWasDeleted - 1,
          });
        })
      );
    });
  });
