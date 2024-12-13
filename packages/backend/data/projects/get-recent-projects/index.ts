"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull, desc } from "@mapform/db/utils";
import { projects, teamspaces } from "@mapform/db/schema";
import { getRecentProjectsSchema } from "./schema";
import { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const getRecentProjects = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(getRecentProjectsSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.bySlug(workspaceSlug)) {
        throw new Error("Unauthorized");
      }

      return db
        .select()
        .from(projects)
        .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
        .where(
          and(
            eq(teamspaces.workspaceSlug, workspaceSlug),
            isNull(projects.rootProjectId),
          ),
        )
        .orderBy(desc(projects.updatedAt))
        .limit(5);
    });
