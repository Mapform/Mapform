"server-only";

import { db } from "@mapform/db";
import { views } from "@mapform/db/schema";
import { deleteViewSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const deleteView = (authClient: UserAuthClient) =>
  authClient
    .inputSchema(deleteViewSchema)
    .action(async ({ parsedInput: { viewId }, ctx: { userAccess } }) => {
      // First get the rows with their teamspace information
      const viewToDelete = await db.query.views.findFirst({
        where: eq(views.id, viewId),
        with: {
          project: {
            columns: {
              teamspaceId: true,
            },
          },
        },
      });

      if (!viewToDelete) {
        throw new Error("View not found");
      }

      // Validate that all rows are from teamspaces the user has access to
      if (
        !userAccess.teamspace.checkAccessById(viewToDelete.project.teamspaceId)
      ) {
        throw new Error("Unauthorized");
      }

      return db.delete(views).where(eq(views.id, viewId)).returning({
        id: views.id,
      });
    });
