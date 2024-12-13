"server-only";

import { db } from "@mapform/db";
import { and, eq, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { deleteProjectSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const deleteProject = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(deleteProjectSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      return db
        .delete(projects)
        .where(
          and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, teamspaceIds),
          ),
        );
    });
