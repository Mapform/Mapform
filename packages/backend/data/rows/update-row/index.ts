"server-only";

import { rows } from "@mapform/db/schema";
import type { columnTypeEnum } from "@mapform/db/schema";
import { updateRowSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";
import { inngest } from "../../../clients/inngest/client";

export const updateRow = (authClient: UserAuthClient) =>
  authClient
    .schema(updateRowSchema)
    .action(
      async ({
        parsedInput: { id, name, description, descriptionAsMarkdown, icon },
        ctx: { userAccess, db },
      }) => {
        const existingRow = await db.query.rows.findFirst({
          where: eq(rows.id, id),
          with: {
            project: true,
            cells: {
              with: {
                stringCell: true,
                numberCell: true,
                booleanCell: true,
                dateCell: true,
                column: true,
              },
            },
          },
        });

        if (!existingRow) {
          throw new Error("Row not found.");
        }

        if (
          !userAccess.teamspace.checkAccessById(existingRow.project.teamspaceId)
        ) {
          throw new Error("Unauthorized.");
        }

        const [updatedRow] = await db
          .update(rows)
          .set({
            name,
            icon,
            description,
          })
          .where(eq(rows.id, id))
          .returning();

        if (!updatedRow) {
          throw new Error("Row not found.");
        }

        // Prepare cell data for embedding generation
        const cellData = existingRow.cells.map((cell) => {
          let value: any = null;
          let columnType: (typeof columnTypeEnum.enumValues)[number] = "string";

          if (cell.stringCell) {
            value = cell.stringCell.value;
            columnType = "string";
          } else if (cell.numberCell) {
            value = cell.numberCell.value;
            columnType = "number";
          } else if (cell.booleanCell) {
            value = cell.booleanCell.value;
            columnType = "bool";
          } else if (cell.dateCell) {
            value = cell.dateCell.value;
            columnType = "date";
          }

          return {
            id: cell.id,
            columnName: cell.column.name,
            columnType,
            value,
          };
        });

        await inngest.send({
          name: "app/generate.embeddings",
          data: {
            rows: [
              {
                id: updatedRow.id,
                icon: updatedRow.icon,
                name: updatedRow.name,
                description: updatedRow.description,
                descriptionAsMarkdown,
                cells: cellData,
              },
            ],
          },
        });

        return updatedRow;
      },
    );
