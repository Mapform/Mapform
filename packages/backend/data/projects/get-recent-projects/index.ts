"server-only";

import { db } from "@mapform/db";
import { eq, desc } from "@mapform/db/utils";
import { projects, teamspaces } from "@mapform/db/schema";
import { getRecentProjectsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

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
        .where(eq(teamspaces.workspaceSlug, workspaceSlug))
        .orderBy(desc(projects.updatedAt))
        .limit(5);
    });
