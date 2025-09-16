"server-only";

import { views } from "@mapform/db/schema";
import { updateViewSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const updateView = (authClient: UserAuthClient) =>
  authClient
    .schema(updateViewSchema)
    .action(
      async ({
        parsedInput: { viewId, ...updates },
        ctx: { userAccess, db },
      }) => {
        // First get the view with its project and teamspace information
        const viewToUpdate = await db.query.views.findFirst({
          where: eq(views.id, viewId),
          with: {
            project: {
              columns: {
                teamspaceId: true,
              },
            },
          },
        });

        if (!viewToUpdate) {
          throw new Error("View not found");
        }

        // Validate that the user has access to the teamspace
        if (
          !userAccess.teamspace.checkAccessById(
            viewToUpdate.project.teamspaceId,
          )
        ) {
          throw new Error("Unauthorized");
        }

        // Update the view with the provided fields
        const [updatedView] = await db
          .update(views)
          .set(updates)
          .where(eq(views.id, viewId))
          .returning();

        if (!updatedView) {
          throw new Error("Failed to update view");
        }

        return updatedView;
      },
    );
