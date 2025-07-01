"server-only";

import { db } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { folders } from "@mapform/db/schema";
import { updateFolderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateFolder = (authClient: UserAuthClient) =>
  authClient
    .schema(updateFolderSchema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      return db
        .update(folders)
        .set(rest)
        .where(
          and(eq(folders.id, id), inArray(folders.teamspaceId, teamspaceIds)),
        )
        .returning();
    });
