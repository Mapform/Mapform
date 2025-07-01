"server-only";

import { db } from "@mapform/db";
import { fileTreePositions, folders } from "@mapform/db/schema";
import { createFolderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, count, eq, isNull } from "@mapform/db/utils";

export const createFolder = (authClient: UserAuthClient) =>
  authClient
    .schema(createFolderSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, parentId },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const [fileTreeCount] = await db
          .select({ count: count() })
          .from(fileTreePositions)
          .where(
            and(
              eq(fileTreePositions.teamspaceId, teamspaceId),
              ...(parentId
                ? [eq(fileTreePositions.id, parentId)]
                : [isNull(fileTreePositions.parentId)]),
            ),
          );

        return db.transaction(async (tx) => {
          const [fileTreePosition] = await tx
            .insert(fileTreePositions)
            .values({
              teamspaceId,
              parentId,
              itemType: "folder",
              position: fileTreeCount?.count ?? 0,
            })
            .returning();

          if (!fileTreePosition) {
            throw new Error("Failed to create file tree position");
          }

          const [folder] = await tx
            .insert(folders)
            .values({
              teamspaceId,
              fileTreePositionId: fileTreePosition.id,
            })
            .returning();

          if (!folder) {
            throw new Error("Failed to create folder");
          }

          return folder;
        });
      },
    );
