"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { updateRowSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const updateRow = (authClient: UserAuthClient) =>
  authClient
    .schema(updateRowSchema)
    .action(
      async ({
        parsedInput: { id, name, description, icon },
        ctx: { userAccess },
      }) => {
        const existingRow = await db.query.rows.findFirst({
          where: eq(rows.id, id),
          with: {
            project: true,
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

        return db
          .update(rows)
          .set({
            name,
            icon,
            description,
          })
          .where(eq(rows.id, id))
          .returning();
      },
    );
