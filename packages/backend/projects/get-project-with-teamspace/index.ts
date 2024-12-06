"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects, teamspaces } from "@mapform/db/schema";
import type { GetProjectWithTeamspaceSchema } from "./schema";

export const getProjectWithTeamspace = async ({
  id,
}: GetProjectWithTeamspaceSchema) => {
  // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
  // Once fix is merged we can simplify this
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), isNull(projects.rootProjectId)),
    with: {
      childProjects: {
        columns: {
          id: true,
        },
      },
      submissionsDataset: {
        columns: {
          id: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const teamspace = await db.query.teamspaces.findFirst({
    where: eq(teamspaces.id, project.teamspaceId),
    columns: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  if (!teamspace) {
    return null;
  }

  return {
    ...project,
    teamspace,
  };
};

export type ProjectWithTeamspace = NonNullable<
  Awaited<ReturnType<typeof getProjectWithTeamspace>>
>;
