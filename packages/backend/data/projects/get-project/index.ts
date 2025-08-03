"server-only";

import type { Geometry, Point } from "geojson";
import { db, sql } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects, rows } from "@mapform/db/schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { getProjectSchema } from "./schema";

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

      const rowWhereOptions = and(eq(rows.projectId, projectId), boundsFilter);

      const [project, projectRows, rowCount] = await Promise.all([
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
            blobs: true,
          },
          extras: {
            center:
              sql<Point>`ST_AsGeoJSON(ST_Centroid(${projects.center}))::jsonb`.as(
                "center",
              ),
          },
        }),
        db.query.rows.findMany({
          where: rowWhereOptions,
          limit: filter?.type === "page" ? filter.perPage : undefined,
          offset:
            filter?.type === "page" ? filter.page * filter.perPage : undefined,
          orderBy: (rows, { desc, asc }) => [
            desc(rows.createdAt),
            asc(rows.id),
          ],
          columns: {
            id: true,
            icon: true,
            name: true,
            geometry: true,
          },
          extras: {
            geometry: sql<Geometry>`ST_AsGeoJSON(${rows.geometry})::jsonb`.as(
              "geometry",
            ),
            center:
              sql<Point>`ST_AsGeoJSON(ST_Centroid(${rows.geometry}))::jsonb`.as(
                "center",
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
            blobs: true,
          },
        }),
        db.$count(rows, rowWhereOptions),
      ]);

      if (!project) {
        throw new Error("Project not found");
      }

      return {
        ...project,
        rows: projectRows,
        rowCount,
      };
    });

export type GetProject = UnwrapReturn<typeof getProject>;
