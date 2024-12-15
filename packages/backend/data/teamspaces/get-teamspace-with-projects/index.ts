"server-only";

import { db } from "@mapform/db";
import { eq, and, isNull } from "@mapform/db/utils";
import { projects, teamspaces } from "@mapform/db/schema";
import { getTeamspaceWithProjectsSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const getTeamspaceWithProjects = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(getTeamspaceWithProjectsSchema)
    .action(
      async ({
        parsedInput: { teamspaceSlug, workspaceSlug },
        ctx: { userAccess },
      }) => {
        if (
          !userAccess.teamspace.checkAccessBySlug(teamspaceSlug, workspaceSlug)
        ) {
          throw new Error("Unauthorized");
        }

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
      },
    );

export type TeamspaceWithProjects = UnwrapReturn<
  typeof getTeamspaceWithProjects
>;
