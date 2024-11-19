"server-only";

import { db } from "@mapform/db";
import { projects, teamspaces } from "@mapform/db/schema";
import { eq, and, isNull } from "@mapform/db/utils";
import type { GetTeamspaceWithProjectsSchema } from "./schema";

export const getTeamspaceWithProjects = async ({
  teamspaceSlug,
  workspaceSlug,
}: GetTeamspaceWithProjectsSchema) => {
  return db.query.teamspaces.findFirst({
    where: and(
      eq(teamspaces.slug, teamspaceSlug),
      eq(teamspaces.workspaceSlug, workspaceSlug),
    ),
    with: {
      workspace: {
        columns: {
          name: true,
        },
      },
      projects: {
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
        where: isNull(projects.rootProjectId),
      },
    },
  });
};

export type TeamspaceWithProjects = NonNullable<
  Awaited<ReturnType<typeof getTeamspaceWithProjects>>
>;
