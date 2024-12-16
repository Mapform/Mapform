"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull, desc } from "@mapform/db/utils";
import { projects, teamspaces } from "@mapform/db/schema";
import { getRecentProjectsSchema } from "./schema";
import { UserAuthClient } from "../../../lib/types";

export const getRecentProjects = (authClient: UserAuthClient) =>
  authClient
    .schema(getRecentProjectsSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
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
