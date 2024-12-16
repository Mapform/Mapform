"server-only";

import { db } from "@mapform/db";
import { datasets, teamspaces } from "@mapform/db/schema";
import { eq, and } from "@mapform/db/utils";
import { listTeamspaceDatasetsSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const listTeamspaceDatasets = (authClient: UserAuthClient) =>
  authClient
    .schema(listTeamspaceDatasetsSchema)
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

        const teamspace = await db.query.teamspaces.findFirst({
          where: and(
            eq(teamspaces.slug, teamspaceSlug),
            eq(teamspaces.workspaceSlug, workspaceSlug),
          ),
        });

        if (!teamspace) {
          throw new Error("Teamspace not found");
        }

        return db.query.datasets.findMany({
          where: eq(datasets.teamspaceId, teamspace.id),
          with: {
            columns: true,
          },
        });
      },
    );

export type ListTeamspaceDatasets = UnwrapReturn<typeof listTeamspaceDatasets>;
