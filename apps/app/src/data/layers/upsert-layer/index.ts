"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { layers, layersToPages, pointLayers } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { upsertLayerSchema } from "./schema";

export const upsertLayer = authAction
  .schema(upsertLayerSchema)
  .action(
    async ({
      parsedInput: { id, datasetId, pageId, name, type, pointProperties },
    }) => {
      await db.transaction(async (tx) => {
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
        if (!id) {
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
          if (id) {
            await tx
              .update(pointLayers)
              .set({
                pointColumnId: pointProperties.pointColumnId,
                titleColumnId: pointProperties.titleColumnId,
                descriptionColumnId: pointProperties.descriptionColumnId,
              })
              .where(eq(pointLayers.layerId, id));
          } else {
            await tx.insert(pointLayers).values({
              layerId: layer.id,
              pointColumnId: pointProperties.pointColumnId,
              titleColumnId: pointProperties.titleColumnId,
              descriptionColumnId: pointProperties.descriptionColumnId,
            });
          }
        }
      });

      revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
    },
  );
