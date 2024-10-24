"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { eq } from "@mapform/db/utils";
import {
  cells,
  layers,
  pointCells,
  richtextCells,
  rows,
  stringCells,
} from "@mapform/db/schema";
import type { DocumentContent } from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { createPointSchema } from "./schema";

export const createPoint = authAction
  .schema(createPointSchema)
  .action(
    async ({ parsedInput: { layerId, title, description, location } }) => {
      await db.transaction(async (tx) => {
        const layer = await tx.query.layers.findFirst({
          where: eq(layers.id, layerId),
          with: {
            pointLayer: true,
          },
        });

        if (!layer) {
          throw new Error("Layer not found");
        }

        if (!layer.pointLayer) {
          throw new Error("Layer is not a point layer");
        }

        const [row] = await tx
          .insert(rows)
          .values({
            datasetId: layer.datasetId,
          })
          .returning();

        if (!row) {
          throw new Error("Row not created");
        }

        const [titleCell, descriptionCell, pointCell] = await tx
          .insert(cells)
          .values([
            {
              rowId: row.id,
              columnId: layer.pointLayer.titleColumnId,
            },
            {
              rowId: row.id,
              columnId: layer.pointLayer.descriptionColumnId,
            },
            {
              rowId: row.id,
              columnId: layer.pointLayer.pointColumnId,
            },
          ])
          .returning();

        if (!titleCell || !descriptionCell || !pointCell) {
          throw new Error("Cells not created");
        }

        await tx.insert(stringCells).values({
          cellId: titleCell.id,
          value: title,
        });

        await tx.insert(richtextCells).values({
          cellId: descriptionCell.id,
          value: description as { content: DocumentContent },
        });

        await tx.insert(pointCells).values({
          cellId: pointCell.id,
          value: location,
        });
      });

      revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
    },
  );
