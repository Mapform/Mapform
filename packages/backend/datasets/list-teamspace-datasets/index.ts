"server-only";

import { db } from "@mapform/db";
import { eq, and } from "@mapform/db/utils";
import { datasets, teamspaces } from "@mapform/db/schema";
import { type ListAvailableDatasetsSchema } from "./schema";

export const listTeamspaceDatasets = async ({
  workspaceSlug,
  teamspaceSlug,
}: ListAvailableDatasetsSchema) => {
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
};

export type ListTeamspaceDatasets = NonNullable<
  NonNullable<Awaited<ReturnType<typeof listTeamspaceDatasets>>>
>;
