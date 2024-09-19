"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getWorkspaceWithTeamsSchema } from "./schema";

export const getWorkspaceWithTeams = authAction
  .schema(getWorkspaceWithTeamsSchema)
  .action(async ({ parsedInput: { slug } }) => {
    const currentWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
      columns: {
        id: true,
        name: true,
        slug: true,
      },
      with: {
        teamspaces: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return currentWorkspace;
  });

export type WorkspaceWithTeams = Awaited<
  ReturnType<typeof getWorkspaceWithTeams>
>;
