"server-only";

import { db } from "@mapform/db";
import { and, eq, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { deleteProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deleteProject = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteProjectSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      await db
        .delete(projects)
        .where(
          and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, teamspaceIds),
          ),
        );
    });
