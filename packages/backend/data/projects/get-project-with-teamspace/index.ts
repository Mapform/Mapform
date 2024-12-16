"server-only";

import { db } from "@mapform/db";
import { projects, teamspaces } from "@mapform/db/schema";
import { and, eq, inArray, isNull } from "@mapform/db/utils";
import { getProjectWithTeamspaceSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const getProjectWithTeamspace = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(getProjectWithTeamspaceSchema)
    .action(async ({ parsedInput: { id }, ctx: { userAccess } }) => {
      // TODO: Cannot use 'with' with geometry columns currently due to Drizzle bug: https://github.com/drizzle-team/drizzle-orm/issues/2526
      // Once fix is merged we can simplify this
      const project = await db.query.projects.findFirst({
        where: and(
          eq(projects.id, id),
          isNull(projects.rootProjectId),
          inArray(projects.teamspaceId, userAccess.teamspace.ids),
        ),
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
    });

export type ProjectWithTeamspace = UnwrapReturn<typeof getProjectWithTeamspace>;
