"server-only";

import { db } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { updateProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateProject = (authClient: UserAuthClient) =>
  authClient
    .inputSchema(updateProjectSchema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      return db
        .update(projects)
        .set(rest)
        .where(
          and(eq(projects.id, id), inArray(projects.teamspaceId, teamspaceIds)),
        )
        .returning();
    });
