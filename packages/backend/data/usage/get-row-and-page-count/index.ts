"server-only";

import { db } from "@mapform/db";
import {
  pages,
  projects,
  teamspaces,
  workspaces,
  rows,
  datasets,
} from "@mapform/db/schema";
import { and, count, eq, isNull } from "@mapform/db/utils";
import { getRowAndPageCountSchema } from "./schema";
import type { UserAuthClient, PublicClient } from "../../../lib/types";

export const getRowAndPageCount = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getRowAndPageCountSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx }) => {
      if (
        ctx.authType === "user" &&
        !ctx.userAccess.workspace.checkAccessBySlug(workspaceSlug)
      ) {
        throw new Error("Unauthorized");
      }

      const [[rowsResponse], [pagesResponse]] = await Promise.all([
        db
          .select({ rowCount: count(rows.id) })
          .from(rows)
          .leftJoin(datasets, eq(datasets.id, rows.datasetId))
          .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
          .leftJoin(workspaces, eq(workspaces.slug, teamspaces.workspaceSlug))
          .where(eq(workspaces.slug, workspaceSlug)),

        db
          .select({ pageCount: count(pages.id) })
          .from(pages)
          .leftJoin(projects, eq(projects.id, pages.projectId))
          .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
          .leftJoin(workspaces, eq(workspaces.slug, teamspaces.workspaceSlug))
          .where(
            and(
              eq(teamspaces.workspaceSlug, workspaceSlug),
              // We only count pages in the root project. Otherwise, users would
              // get double-counted for every project version.
              isNull(projects.rootProjectId),
            ),
          ),
      ]);

      return {
        rowCount: rowsResponse?.rowCount,
        pageCount: pagesResponse?.pageCount,
      };
    });
