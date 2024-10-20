"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { layers, layersToPages, pointLayers } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayer = authAction
  .schema(createLayerSchema)
  .action(
    async ({
      parsedInput: { datasetId, pageId, name, type, pointProperties },
    }) => {
      const existingPageLayers = await db.query.layersToPages.findMany({
        where: eq(layersToPages.pageId, pageId),
      });

      await db.transaction(async (tx) => {
        const [layer] = await tx
          .insert(layers)
          .values({
            datasetId,
            name,
            type,
          })
          .returning();

        if (!layer) {
          throw new Error("Failed to create layer");
        }

        await tx
          .insert(layersToPages)
          .values({
            layerId: layer.id,
            pageId,
            position: existingPageLayers.length + 1,
          })
          .returning();

        if (type === "point" && pointProperties) {
          await tx.insert(pointLayers).values({
            layerId: layer.id,
            pointColumnId: pointProperties.pointColumnId,
            titleColumnId: pointProperties.titleColumnId,
            descriptionColumnId: pointProperties.descriptionColumnId,
          });
        }
      });

      revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
    },
  );
