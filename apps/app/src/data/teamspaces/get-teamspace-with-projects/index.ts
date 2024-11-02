"server-only";

import { db } from "@mapform/db";
import { teamspaces } from "@mapform/db/schema";
import { eq, and } from "@mapform/db/utils";
import { authAction } from "~/lib/safe-action";
import { getTeamspaceWithProjectsSchema } from "./schema";

export const getTeamspaceWithProjects = authAction
  .schema(getTeamspaceWithProjectsSchema)
  .action(async ({ parsedInput: { teamspaceSlug, workspaceSlug } }) => {
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
        },
      },
    });
  });

export type TeamspaceWithProjects = NonNullable<
  Awaited<ReturnType<typeof getTeamspaceWithProjects>>
>["data"];
