"server-only";

import { db } from "@mapform/db";
import { and, eq } from "@mapform/db/utils";
import {
  Cell,
  cells,
  columns,
  pages,
  rows,
  stringCells,
} from "@mapform/db/schema";
import { submitPageSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { publicMiddleware } from "../../../lib/middleware";
import { getFormSchemaFromBlockNote } from "@mapform/blocknote";

export const submitPage = (authClient: AuthClient) =>
  authClient
    .use(publicMiddleware)
    .schema(submitPageSchema)
    .action(async ({ parsedInput: { pageId, submissionId, payload } }) => {
      const [page, row] = await Promise.all([
        db.query.pages.findFirst({
          where: eq(pages.id, pageId),
        }),
        db.query.rows.findFirst({
          where: eq(pages.id, submissionId),
        }),
      ]);

      if (!page) {
        throw new Error("Page not found");
      }

      if (!row) {
        throw new Error("Submission not found");
      }

      const documentContent = page.content?.content;

      if (!documentContent) {
        throw new Error("Page has no content");
      }

      const validationSchema = getFormSchemaFromBlockNote(documentContent);
      const { data, error } = validationSchema.safeParse(payload);

      if (error) {
        throw new Error("Invalid payload");
      }

      await db.transaction(async (tx) => {
        await Promise.all(
          Object.entries(data).map(async ([key, value]) => {
            const block = documentContent.find((b) => b.id === key);

            if (!block) {
              throw new Error("Block not found");
            }

            const column = await db.query.columns.findFirst({
              where: eq(columns.blockNoteId, block.id),
            });

            if (!column) {
              throw new Error("Column not found");
            }

            let cell: Cell | undefined;

            /**
             * Try to find the cell
             */
            cell = await tx.query.cells.findFirst({
              where: and(eq(columns.id, column.id), eq(rows.id, row.id)),
              with: {
                booleanCell: true,
                pointCell: true,
                stringCell: true,
                dateCell: true,
                numberCell: true,
              },
            });

            /**
             * If cell doesn't exist, create it
             */
            if (!cell) {
              const [newCell] = await tx
                .insert(cells)
                .values({
                  columnId: column.id,
                  rowId: row.id,
                })
                .returning();

              cell = newCell;
            }

            if (!cell) {
              throw new Error("Cell not found");
            }

            if (block.type === "textInput") {
              return tx
                .insert(stringCells)
                .values({
                  value: value as string,
                  cellId: cell.id,
                })
                .onConflictDoUpdate({
                  target: stringCells.id,
                  set: { value: value as string },
                });
            }

            if (block.type === "pin") {
              return tx
                .insert(stringCells)
                .values({
                  value: value as string,
                  cellId: cell.id,
                })
                .onConflictDoUpdate({
                  target: stringCells.id,
                  set: { value: value as string },
                });
            }
          }),
        );
      });
    });
