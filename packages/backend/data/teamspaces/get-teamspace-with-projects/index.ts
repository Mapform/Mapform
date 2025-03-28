"server-only";

import { db } from "@mapform/db";
import { eq, and } from "@mapform/db/utils";
import { teamspaces } from "@mapform/db/schema";
import { getTeamspaceWithProjectsSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getTeamspaceWithProjects = (authClient: UserAuthClient) =>
  authClient
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
            },
          },
        });
      },
    );

export type TeamspaceWithProjects = UnwrapReturn<
  typeof getTeamspaceWithProjects
>;
