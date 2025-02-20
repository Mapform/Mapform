"server-only";

import { db } from "@mapform/db";
import { projects, workspaces } from "@mapform/db/schema";
import { eq, isNull } from "@mapform/db/utils";
import { getWorkspaceDirectorySchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getWorkspaceDirectory = (authClient: UserAuthClient) =>
  authClient
    .schema(getWorkspaceDirectorySchema)
    .action(({ parsedInput: { slug } }) => {
      return db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug),
        columns: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
        with: {
          plan: true,
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
                with: {
                  project: {
                    columns: {
                      id: true,
                    },
                  },
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
    });

export type WorkspaceDirectory = UnwrapReturn<typeof getWorkspaceDirectory>;
