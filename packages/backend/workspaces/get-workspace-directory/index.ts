import { db } from "@mapform/db";
import { projects, workspaces } from "@mapform/db/schema";
import { eq, isNull } from "@mapform/db/utils";
import type { GetWorkspaceDirectorySchema } from "./schema";

export const getWorkspaceDirectory = ({
  slug,
}: GetWorkspaceDirectorySchema) => {
  return db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
    columns: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
    with: {
      teamspaces: {
        columns: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
        with: {
          datasets: {
            columns: {
              id: true,
              name: true,
              createdAt: true,
            },
            orderBy: (datasets, { asc }) => [asc(datasets.createdAt)],
          },
          projects: {
            columns: {
              id: true,
              name: true,
              createdAt: true,
            },
            // Only include root projects
            where: isNull(projects.rootProjectId),
            orderBy: (projects, { asc }) => [asc(projects.createdAt)],
          },
        },
      },
    },
  });
};

export type WorkspaceWithTeamspaces = NonNullable<
  Awaited<ReturnType<typeof getWorkspaceDirectory>>
>;
