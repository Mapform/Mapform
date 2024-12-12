import { db } from "@mapform/db";
import { eq, and, isNull, desc } from "@mapform/db/utils";
import { projects, teamspaces, workspaces } from "@mapform/db/schema";
import type { GetRecentProjectsSchema } from "./schema";

export const getRecentProjects = async ({
  workspaceSlug,
}: GetRecentProjectsSchema) => {
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
};
