"server-only";

import { db } from "@mapform/db";
import { folders, projects } from "@mapform/db/schema";
import { createFolderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, count, eq, isNull } from "@mapform/db/utils";

export const createFolder = (authClient: UserAuthClient) =>
  authClient
    .schema(createFolderSchema)
    .action(async ({ parsedInput: { teamspaceId }, ctx: { userAccess } }) => {
      if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
        throw new Error("Unauthorized");
      }

      const [[folderCount], [projectCount]] = await Promise.all([
        db
          .select({ count: count() })
          .from(folders)
          .where(
            and(eq(folders.teamspaceId, teamspaceId), isNull(folders.parentId)),
          ),
        db
          .select({ count: count() })
          .from(projects)
          .where(eq(projects.teamspaceId, teamspaceId)),
      ]);

      return db
        .insert(folders)
        .values({
          teamspaceId,
          position: (folderCount?.count ?? 0) + (projectCount?.count ?? 0) + 1,
        })
        .returning();
    });
