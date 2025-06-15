"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { deleteRowsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { inArray } from "@mapform/db/utils";

export const deleteRows = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteRowsSchema)
    .action(async ({ parsedInput: { rowIds }, ctx: { userAccess } }) => {
      // First get the rows with their teamspace information
      const rowsToDelete = await db.query.rows.findMany({
        where: inArray(rows.id, rowIds),
        with: {
          project: {
            columns: {
              teamspaceId: true,
            },
          },
        },
      });

      // Validate that all rows are from teamspaces the user has access to
      if (
        rowsToDelete.some(
          (row) =>
            !userAccess.teamspace.checkAccessById(row.project.teamspaceId),
        )
      ) {
        throw new Error("Unauthorized");
      }

      return db.delete(rows).where(inArray(rows.id, rowIds)).returning({
        id: rows.id,
      });
    });
