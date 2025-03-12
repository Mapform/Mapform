"server-only";

import { db } from "@mapform/db";
import {
  rows,
  pointCells,
  datasets,
  teamspaces,
  pointLayers,
} from "@mapform/db/schema";
import { and, eq, inArray, sql } from "@mapform/db/utils";
import { getLayerPointSchema } from "./schema";
import type {
  UserAuthClient,
  PublicClient,
  UnwrapReturn,
} from "../../../lib/types";

export const getLayerPoint = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getLayerPointSchema)
    .action(async ({ parsedInput: { rowId, pointLayerId }, ctx }) => {
      if (ctx.authType === "public") {
        // TODO: Need to add this condition once projects are given access levels
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

      const [pointLayer, row] = await Promise.all([
        db.query.pointLayers.findFirst({
          where: eq(pointLayers.id, pointLayerId),
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

      if (!pointLayer) {
        throw new Error("Point layer not found");
      }

      return {
        rowId,
        pointLayerId,
        title: row.cells.find((c) => c.columnId === pointLayer.titleColumnId),
        description: row.cells.find(
          (c) => c.columnId === pointLayer.descriptionColumnId,
        ),
        location: row.cells.find(
          (c) => c.columnId === pointLayer.pointColumnId,
        ),
        icon: row.cells.find((c) => c.columnId === pointLayer.iconColumnId),
        cells: row.cells.filter(
          (c) =>
            c.columnId !== pointLayer.pointColumnId &&
            c.columnId !== pointLayer.titleColumnId &&
            c.columnId !== pointLayer.descriptionColumnId &&
            c.columnId !== pointLayer.iconColumnId,
        ),
      };
    });

export type GetLayerPoint = UnwrapReturn<typeof getLayerPoint>;
