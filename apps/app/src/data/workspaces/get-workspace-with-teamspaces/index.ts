"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getWorkspaceWithTeamspacesSchema } from "./schema";

export const getWorkspaceWithTeamspaces = authAction
  .schema(getWorkspaceWithTeamspacesSchema)
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
                createdAt: true,
              },
            },
          },
        },
      },
    });
  });

export type WorkspaceWithTeamspaces = NonNullable<
  Awaited<ReturnType<typeof getWorkspaceWithTeamspaces>>
>["data"];
