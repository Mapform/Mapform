"server-only";

import { db } from "@mapform/db";
import { datasets, rows, teamspaces, workspaces } from "@mapform/db/schema";
import { count, eq } from "@mapform/db/utils";
import { countWorkspaceRowsSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const countWorkspaceRows = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(countWorkspaceRowsSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx: { userAccess } }) => {
      if (!userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
        throw new Error("Unauthorized");
      }

      const [response] = await db
        .select({ rowsCount: count(rows.id) })
        .from(rows)
        .leftJoin(datasets, eq(datasets.id, rows.datasetId))
        .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
        .leftJoin(workspaces, eq(workspaces.slug, teamspaces.workspaceSlug))
        .where(eq(workspaces.slug, workspaceSlug));

      return response?.rowsCount;
    });
