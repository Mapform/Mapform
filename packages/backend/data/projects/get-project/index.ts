"server-only";

import { db, sql } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects, rows } from "@mapform/db/schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { getProjectSchema } from "./schema";

const ROWS_PER_PAGE = 50;

/**
 * return the project and associated rows and column data
 */
export const getProject = (authClient: UserAuthClient) =>
  authClient
    .schema(getProjectSchema)
    .action(async ({ parsedInput: { projectId, filter }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      // Create bounds filter if bounds are provided
      const boundsFilter =
        filter?.type === "bounds"
          ? sql`ST_Intersects(${rows.geometry}, ST_MakeEnvelope(${filter.bounds.west}, ${filter.bounds.south}, ${filter.bounds.east}, ${filter.bounds.north}, 4326))`
          : undefined;

      const [project, projectRows] = await Promise.all([
        db.query.projects.findFirst({
          where: and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, teamspaceIds),
          ),
          with: {
            views: {
              with: {
                tableView: true,
                mapView: true,
              },
            },
            columns: true,
          },
        }),
        db.query.rows.findMany({
          where: and(eq(rows.projectId, projectId), boundsFilter),
          limit: filter?.type === "page" ? ROWS_PER_PAGE : undefined,
          offset:
            filter?.type === "page" ? filter.page * ROWS_PER_PAGE : undefined,
          columns: {
            id: true,
            icon: true,
            name: true,
            description: true,
            geometry: true,
          },
          extras: {
            geometry: sql<string>`ST_AsGeoJSON(${rows.geometry})::jsonb`.as(
              "geometry",
            ),
          },
          with: {
            cells: {
              with: {
                stringCell: true,
                numberCell: true,
                booleanCell: true,
                dateCell: true,
                column: true,
              },
            },
          },
        }),
      ]);

      if (!project) {
        throw new Error("Project not found");
      }

      return {
        ...project,
        rows: projectRows,
      };
    });

export type GetProject = UnwrapReturn<typeof getProject>;
