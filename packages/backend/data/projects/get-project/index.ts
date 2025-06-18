"server-only";

import { db, sql } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects, rows } from "@mapform/db/schema";
import type { UnwrapReturn, UserAuthClient } from "../../../lib/types";
import { getProjectSchema } from "./schema";

export const getProject = (authClient: UserAuthClient) =>
  authClient
    .schema(getProjectSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      const project = await db.query.projects.findFirst({
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
          rows: {
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
          },
          columns: true,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    });

export type GetProject = UnwrapReturn<typeof getProject>;
