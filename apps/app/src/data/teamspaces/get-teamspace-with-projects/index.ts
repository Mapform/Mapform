"server-only";

import { db } from "@mapform/db";
import { teamspaces, workspaces } from "@mapform/db/schema";
import { eq, and } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getTeamspaceWithProjectsSchema } from "./schema";

export const getTeamspaceWithProjects = authAction
  .schema(getTeamspaceWithProjectsSchema)
  .action(async ({ parsedInput: { teamspaceSlug, workspaceSlug } }) => {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, workspaceSlug),
      columns: {
        id: true,
        createdAt: true,
      },
    });

    if (!workspace) {
      return null;
    }

    return db.query.teamspaces.findFirst({
      where: and(
        eq(teamspaces.slug, teamspaceSlug),
        eq(teamspaces.workspaceId, workspace.id)
      ),
      with: {
        projects: {
          columns: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
          },
        },
      },
    });
  });

export type TeamspaceWithProjects = NonNullable<
  Awaited<ReturnType<typeof getTeamspaceWithProjects>>
>["data"];
