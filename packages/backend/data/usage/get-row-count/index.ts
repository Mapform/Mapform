"server-only";

import { db } from "@mapform/db";
import { projects, teamspaces, workspaces, rows } from "@mapform/db/schema";
import { count, eq } from "@mapform/db/utils";
import { getRowAndPageCountSchema } from "./schema";
import type { UserAuthClient, PublicClient } from "../../../lib/types";

export const getRowCount = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .inputSchema(getRowAndPageCountSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx }) => {
      if (
        ctx.authType === "user" &&
        !ctx.userAccess.workspace.checkAccessBySlug(workspaceSlug)
      ) {
        throw new Error("Unauthorized");
      }

      const rowsResponse = await db
        .select({ rowCount: count(rows.id) })
        .from(rows)
        .leftJoin(projects, eq(projects.id, rows.projectId))
        .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
        .leftJoin(workspaces, eq(workspaces.slug, teamspaces.workspaceSlug))
        .where(eq(workspaces.slug, workspaceSlug));

      return rowsResponse[0]?.rowCount;
    });
