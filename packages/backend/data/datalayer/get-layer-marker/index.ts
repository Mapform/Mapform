"server-only";

import { db } from "@mapform/db";
import {
  rows,
  pointCells,
  markerLayers,
  datasets,
  teamspaces,
  polygonCells,
  lineCells,
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

        if (!rowResult.length) {
          throw new Error("Row not found");
        }
      }

      // If userAuth,
      const [markerLayer, row] = await Promise.all([
        db.query.markerLayers.findFirst({
          where: eq(markerLayers.id, markerLayerId),
          with: {
            layer: {
              columns: {
                id: true,
              },
            },
          },
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
                lineCell: {
                  columns: {
                    id: true,
                  },
                  // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                  extras: {
                    coordinates: sql<
                      number[]
                    >`ST_AsText(${lineCells.value})`.as("coordinates"),
                  },
                },
                polygonCell: {
                  columns: {
                    id: true,
                  },
                  // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                  extras: {
                    coordinates: sql<
                      number[]
                    >`ST_AsText(${polygonCells.value})`.as("coordinates"),
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

      const titleCellParent = row.cells.find(
        (c) => c.columnId === markerLayer.titleColumnId,
      );
      const descriptionCellParent = row.cells.find(
        (c) => c.columnId === markerLayer.descriptionColumnId,
      );
      const pointCellParent = row.cells.find(
        (c) => c.columnId === markerLayer.pointColumnId,
      );
      const iconCellParent = row.cells.find(
        (c) => c.columnId === markerLayer.iconColumnId,
      );

      const emptyCell = {
        value: undefined,
      };

      return {
        rowId,
        markerLayerId,
        type: "marker",
        layerId: markerLayer.layer.id,
        title: titleCellParent ?? {
          stringCell: emptyCell,
          columnId: markerLayer.titleColumnId,
        },
        description: descriptionCellParent ?? {
          richtextCell: emptyCell,
          columnId: markerLayer.descriptionColumnId,
        },
        location: pointCellParent ?? {
          pointCell: emptyCell,
          columnId: markerLayer.pointColumnId,
        },
        icon: iconCellParent ?? {
          iconCell: emptyCell,
          columnId: markerLayer.iconColumnId,
        },
        cells: row.cells.filter(
          (c) =>
            c.columnId !== markerLayer.pointColumnId &&
            c.columnId !== markerLayer.titleColumnId &&
            c.columnId !== markerLayer.descriptionColumnId,
        ),
      };
    });

export type GetLayerMarker = UnwrapReturn<typeof getLayerMarker>;
