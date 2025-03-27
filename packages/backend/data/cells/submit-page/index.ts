"server-only";

import { db } from "@mapform/db";
import { and, eq } from "@mapform/db/utils";
import type { Cell } from "@mapform/db/schema";
import {
  cells,
  columns,
  formSubmissions,
  pages,
  pointCells,
  stringCells,
} from "@mapform/db/schema";
import { submitPageSchema } from "./schema";
import type { PublicClient } from "../../../lib/types";
import { getFormSchemaFromBlockNote } from "@mapform/blocknote";

export const submitPage = (authClient: PublicClient) =>
  authClient
    .schema(submitPageSchema)
    .action(async ({ parsedInput: { pageId, submissionId, payload } }) => {
      const [page, formSubmission] = await Promise.all([
        db.query.pages.findFirst({
          where: eq(pages.id, pageId),
          with: {
            project: {
              with: {
                submissionsDataset: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
        }),
        db.query.formSubmissions.findFirst({
          where: eq(formSubmissions.id, submissionId),
          with: {
            row: true,
          },
        }),
      ]);

      if (!page) {
        throw new Error("Page not found");
      }

      if (!formSubmission) {
        throw new Error("Submission not found");
      }

      if (
        page.project.submissionsDataset?.id !== formSubmission.row.datasetId
      ) {
        throw new Error("Dataset mismatch");
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

            [cell] = await tx
              .select()
              .from(cells)
              .where(
                and(
                  eq(cells.columnId, column.id),
                  eq(cells.rowId, formSubmission.row.id),
                ),
              )
              .limit(1);

            /**
             * If cell doesn't exist, create it
             */
            if (!cell) {
              const [newCell] = await tx
                .insert(cells)
                .values({
                  columnId: column.id,
                  rowId: formSubmission.row.id,
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
                  target: stringCells.cellId,
                  set: { value: value as string },
                });
            }

            if (block.type === "pin") {
              const pinValue = value as { x?: number; y?: number };

              if (!pinValue.x || !pinValue.y) {
                return;
              }

              return tx
                .insert(pointCells)
                .values({
                  value: { x: pinValue.x, y: pinValue.y },
                  cellId: cell.id,
                })
                .onConflictDoUpdate({
                  target: pointCells.cellId,
                  set: { value: { x: pinValue.x, y: pinValue.y } },
                });
            }
          }),
        );
      });
    });
