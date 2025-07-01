"server-only";

import { db } from "@mapform/db";
import { fileTreePositions } from "@mapform/db/schema";
import { updateFileTreePositionsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq, and } from "@mapform/db/utils";

export const updateFileTreePositions = (authClient: UserAuthClient) =>
  authClient
    .schema(updateFileTreePositionsSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, parentId, items },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        return db.transaction(async (tx) => {
          // Update each item's position
          for (const item of items) {
            await tx
              .update(fileTreePositions)
              .set({ position: item.position })
              .where(
                and(
                  eq(fileTreePositions.id, item.id),
                  eq(fileTreePositions.itemType, item.itemType),
                  eq(fileTreePositions.teamspaceId, teamspaceId),
                ),
              );
          }

          return { success: true };
        });
      },
    );
