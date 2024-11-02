"server-only";

import { db } from "@mapform/db";
import { eq, and } from "@mapform/db/utils";
import { datasets, teamspaces } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { listTeamspaceDatasetsSchema } from "./schema";

export const listTeamspaceDatasets = authAction
  .schema(listTeamspaceDatasetsSchema)
  .action(async ({ parsedInput: { workspaceSlug, teamspaceSlug } }) => {
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
  });

export type ListTeamspaceDatasets = NonNullable<
  NonNullable<Awaited<ReturnType<typeof listTeamspaceDatasets>>>["data"]
>;
