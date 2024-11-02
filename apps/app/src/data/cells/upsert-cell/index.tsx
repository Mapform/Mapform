"use server";

import { db } from "@mapform/db";
import {
  cells,
  numberCells,
  pointCells,
  stringCells,
  booleanCells,
  richtextCells,
  dateCells,
} from "@mapform/db/schema";
import type { DocumentContent } from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { upsertCellSchema } from "./schema";
import { revalidatePath } from "next/cache";

export const upsertCell = authAction
  .schema(upsertCellSchema)
  .action(async ({ parsedInput: { rowId, columnId, type, value } }) => {
    await db.transaction(async (tx) => {
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
        return tx
          .insert(stringCells)
          .values({
            cellId: cell.id,
            value: value || null,
          })
          .onConflictDoUpdate({
            target: stringCells.cellId,
            set: { value: value || null },
          });
      }

      if (type === "number") {
        return tx
          .insert(numberCells)
          .values({
            cellId: cell.id,
            value: value || null,
          })
          .onConflictDoUpdate({
            target: numberCells.cellId,
            set: { value: value || null },
          });
      }

      if (type === "bool") {
        return tx
          .insert(booleanCells)
          .values({
            cellId: cell.id,
            value,
          })
          .onConflictDoUpdate({
            target: booleanCells.cellId,
            set: { value },
          });
      }

      if (type === "point") {
        await tx
          .insert(pointCells)
          .values({
            cellId: cell.id,
            value,
          })
          .onConflictDoUpdate({
            target: pointCells.cellId,
            set: { value },
          });
      }

      if (type === "richtext") {
        await tx
          .insert(richtextCells)
          .values({
            cellId: cell.id,
            value: value as unknown as { content: DocumentContent },
          })
          .onConflictDoUpdate({
            target: richtextCells.cellId,
            set: { value: value as unknown as { content: DocumentContent } },
          });
      }

      if (type === "date") {
        await tx
          .insert(dateCells)
          .values({
            cellId: cell.id,
            value,
          })
          .onConflictDoUpdate({
            target: dateCells.cellId,
            set: { value },
          });
      }
    });

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/", "page");
  });
