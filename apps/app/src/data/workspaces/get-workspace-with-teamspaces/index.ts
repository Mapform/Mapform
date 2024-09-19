"server-only";

import { db } from "@mapform/db";
import { workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getWorkspaceWithTeamspacesSchema } from "./schema";

export const getWorkspaceWithTeamspaces = authAction
  .schema(getWorkspaceWithTeamspacesSchema)
  .action(async ({ parsedInput: { slug } }) => {
    return db.query.workspaces.findFirst({
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
  });

export type WorkspaceWithTeams = Awaited<
  ReturnType<typeof getWorkspaceWithTeamspaces>
>;
