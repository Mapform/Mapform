"server-only";

import { sql } from "@mapform/db";
import { projects, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { getWorkspaceDirectorySchema } from "./schema";
import type { Point } from "geojson";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const getWorkspaceDirectory = (authClient: UserAuthClient) =>
  authClient
    .schema(getWorkspaceDirectorySchema)
    .action(({ parsedInput: { slug }, ctx: { db } }) => {
      return db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug),
        columns: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
        with: {
          plan: true,
          teamspaces: {
            columns: {
              id: true,
              name: true,
              slug: true,
              isPrivate: true,
              ownerUserId: true,
              createdAt: true,
            },
            with: {
              projects: {
                columns: {
                  id: true,
                  name: true,
                  icon: true,
                  center: true,
                  zoom: true,
                  pitch: true,
                  bearing: true,
                  position: true,
                  createdAt: true,
                },
                extras: {
                  center:
                    sql<Point>`ST_AsGeoJSON(ST_Centroid(${projects.center}))::jsonb`.as(
                      "center",
                    ),
                },
                orderBy: (projects, { asc }) => [asc(projects.position)],
                with: {
                  views: {
                    columns: {
                      id: true,
                      type: true,
                      name: true,
                      position: true,
                    },
                    orderBy: (views, { asc }) => [asc(views.position)],
                  },
                },
              },
            },
          },
        },
      });
    });

export type WorkspaceDirectory = UnwrapReturn<typeof getWorkspaceDirectory>;
