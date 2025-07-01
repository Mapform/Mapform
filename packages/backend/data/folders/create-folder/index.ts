"server-only";

import { db } from "@mapform/db";
import { folders } from "@mapform/db/schema";
import { createFolderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const createFolder = (authClient: UserAuthClient) =>
  authClient
    .schema(createFolderSchema)
    .action(async ({ parsedInput: { teamspaceId }, ctx: { userAccess } }) => {
      if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
        throw new Error("Unauthorized");
      }

      return db
        .insert(folders)
        .values({
          teamspaceId,
        })
        .returning();
    });
