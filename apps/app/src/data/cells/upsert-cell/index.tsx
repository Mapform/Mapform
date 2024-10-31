"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { cells, columns, pointCells, stringCells } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { upsertCellSchema } from "./schema";

export const upsertCell = authAction
  .schema(upsertCellSchema)
  .action(async ({ parsedInput: { rowId, columnId, type, value } }) => {
    await db.transaction(async (tx) => {
      console.log(1111, value);
      const [cell] = await tx
        .insert(cells)
        .values({
          rowId,
          columnId,
        })
        .onConflictDoUpdate({
          target: [cells.rowId, cells.columnId],
          set: { updatedAt: new Date() },
        })
        .returning();

      if (!cell) {
        throw new Error("Failed to create or update cell");
      }

      if (type === "string") {
        console.log(22222, value);
        const x = await tx
          .insert(stringCells)
          .values({
            cellId: cell.id,
            value,
          })
          .onConflictDoUpdate({
            target: stringCells.cellId,
            set: { value },
          })
          .returning();
        console.log(3333, x);
      }

      // if (type === "point") {
      //   await tx
      //     .insert(pointCells)
      //     .values({
      //       cellId: cell.id,
      //       value,
      //     })
      //     .onConflictDoUpdate({
      //       target: pointCells.cellId,
      //       set: { value },
      //     })
      //     .returning();
      // }
    });

    revalidatePath("/[wsSlug]/[tsSlug]/datasets/[dId]/", "page");
  });
