"server-only";

import { db } from "@mapform/db";
import {
  rows,
  pointCells,
  markerLayers,
  datasets,
  teamspaces,
} from "@mapform/db/schema";
import { and, eq, inArray, sql } from "@mapform/db/utils";
import { getLayerMarkerSchema } from "./schema";
import type {
  UserAuthClient,
  PublicClient,
  UnwrapReturn,
} from "../../../lib/types";

export const getLayerMarker = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getLayerMarkerSchema)
    .action(async ({ parsedInput: { rowId, markerLayerId }, ctx }) => {
      // If publicAuth, need to check that the data is from a dataset that has been made public via  a public project
      if (ctx.authType === "public") {
        // TODO: Need to add this condition once projects are given access levels
        // db.select()
        //   .from(markerLayers)
        //   .leftJoin(layers, eq(layers.id, markerLayerId))
        //   .leftJoin(layersToPages, eq(layersToPages.layerId, layers.id))
        //   .leftJoin(pages, eq(pages.id, layersToPages.pageId))
        //   .leftJoin(projects, eq(projects.id, pages.projectId))
        //   .where(
        //     eq(projects.access, "PUBLIC"),
        //     eq(markerLayers.id, markerLayerId),
        //     eq(rows.id, rowId),
        //   );
      }

      if (ctx.authType === "user") {
        const teamspaceIds = ctx.user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        const rowResult = await db
          .select()
          .from(rows)
          .leftJoin(datasets, eq(datasets.id, rows.datasetId))
          .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
          .where(and(eq(rows.id, rowId), inArray(teamspaces.id, teamspaceIds)));

        if (!rowResult?.length) {
          throw new Error("Row not found");
        }
      }

      // If userAuth,
      const [markerLayer, row] = await Promise.all([
        db.query.markerLayers.findFirst({
          where: eq(markerLayers.id, markerLayerId),
        }),
        db.query.rows.findFirst({
          where: eq(rows.id, rowId),
          with: {
            cells: {
              with: {
                stringCell: true,
                numberCell: true,
                booleanCell: true,
                dateCell: true,
                richtextCell: true,
                iconCell: true,
                pointCell: {
                  columns: {
                    id: true,
                  },
                  // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                  extras: {
                    x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                    y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                  },
                },
              },
            },
          },
        }),
      ]);

      if (!row) {
        throw new Error("Row not found");
      }

      if (!markerLayer) {
        throw new Error("Marker layer not found");
      }

      return {
        rowId,
        markerLayerId,
        title: row.cells.find((c) => c.columnId === markerLayer.titleColumnId),
        description: row.cells.find(
          (c) => c.columnId === markerLayer.descriptionColumnId,
        ),
        location: row.cells.find(
          (c) => c.columnId === markerLayer.pointColumnId,
        ),
        icon: row.cells.find((c) => c.columnId === markerLayer.iconColumnId),
        cells: row.cells.filter(
          (c) =>
            c.columnId !== markerLayer.pointColumnId &&
            c.columnId !== markerLayer.titleColumnId &&
            c.columnId !== markerLayer.descriptionColumnId,
        ),
      };
    });

export type GetLayerMarker = UnwrapReturn<typeof getLayerMarker>;
