import { db } from "@mapform/db";
import { datasets, rows, teamspaces, workspaces } from "@mapform/db/schema";
import type { CountWorkspaceRowsSchema } from "./schema";
import { count, eq } from "@mapform/db/utils";

export const countWorkspaceRows = async ({
  workspaceSlug,
}: CountWorkspaceRowsSchema) => {
  const [response] = await db
    .select({ rowsCount: count(rows.id) })
    .from(rows)
    .leftJoin(datasets, eq(datasets.id, rows.datasetId))
    .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
    .leftJoin(workspaces, eq(workspaces.slug, teamspaces.workspaceSlug))
    .where(eq(workspaces.slug, workspaceSlug));

  return response?.rowsCount;
};
