"server-only";

import { db } from "@mapform/db";
import { eq, desc } from "@mapform/db/utils";
import { projects, teamspaces, views } from "@mapform/db/schema";
import { getRecentProjectsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const getRecentProjects = (authClient: UserAuthClient) =>
  authClient
    .schema(getRecentProjectsSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
        throw new Error("Unauthorized");
      }

      const results = await db
        .select({
          project: projects,
          view: views,
        })
        .from(projects)
        .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
        .leftJoin(views, eq(views.projectId, projects.id))
        .where(eq(teamspaces.workspaceSlug, workspaceSlug))
        .orderBy(desc(projects.updatedAt))
        .limit(5);

      // Group views by project
      const projectsWithViews = results.reduce<
        Record<
          string,
          typeof projects.$inferSelect & {
            views: (typeof views.$inferSelect)[];
          }
        >
      >((acc, row) => {
        const projectId = row.project.id;
        if (!acc[projectId]) {
          acc[projectId] = {
            ...row.project,
            views: [],
          };
        }
        if (row.view) {
          acc[projectId].views.push(row.view);
        }
        return acc;
      }, {});

      return Object.values(projectsWithViews);
    });
