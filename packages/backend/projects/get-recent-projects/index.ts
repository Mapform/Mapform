import { db } from "@mapform/db";
import { eq, and, isNull, desc } from "@mapform/db/utils";
import { projects, teamspaces, workspaces } from "@mapform/db/schema";
import type { GetRecentProjectsSchema } from "./schema";

export const getRecentProjects = async ({
  workspaceSlug,
}: GetRecentProjectsSchema) => {
  const records = await db
    .select()
    .from(projects)
    .leftJoin(teamspaces, eq(teamspaces.workspaceSlug, workspaces.slug))
    .orderBy(desc(projects.updatedAt))
    .where(
      and(eq(workspaces.slug, workspaceSlug), isNull(projects.rootProjectId)),
    )
    .limit(5);

  return records.map((record) => record.project);
};
