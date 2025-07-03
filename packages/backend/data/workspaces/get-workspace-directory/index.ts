"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
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
              projects: {
                columns: {
                  id: true,
                  name: true,
                  icon: true,
                  position: true,
                  createdAt: true,
                },
                orderBy: (projects, { asc }) => [asc(projects.position)],
              },
            },
          },
        },
      });
    });

export type WorkspaceDirectory = UnwrapReturn<typeof getWorkspaceDirectory>;
