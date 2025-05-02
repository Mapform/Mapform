"server-only";

import { db } from "@mapform/db";
import {
  rows,
  pointCells,
  datasets,
  teamspaces,
  polygonCells,
  lineCells,
  layers,
} from "@mapform/db/schema";
import { and, eq, inArray, sql } from "@mapform/db/utils";
import type {
  UserAuthClient,
  PublicClient,
  UnwrapReturn,
} from "../../../lib/types";
import { getLayerFeatureSchema } from "./schama";

export const getLayerFeature = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getLayerFeatureSchema)
    .action(async ({ parsedInput: { rowId, layerId }, ctx }) => {
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

      const [layer, row] = await Promise.all([
        db.query.layers.findFirst({
          where: eq(layers.id, layerId),
          with: {
            pointLayer: true,
            markerLayer: true,
            lineLayer: true,
            polygonLayer: true,
            layersToPages: {
              with: {
                page: {
                  with: {
                    project: true,
                  },
                },
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
                  extras: {
                    x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                    y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                  },
                },
                lineCell: {
                  columns: {
                    id: true,
                  },
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

      // If publicAuth, need to check that the data is from a dataset that has
      // been made public via a public project
      if (
        ctx.authType === "public" &&
        layer?.layersToPages.some((l) => l.page.project.visibility === "closed")
      ) {
        throw new Error("Layer not found");
      }

      if (!row) {
        throw new Error("Row not found");
      }

      if (!layer) {
        throw new Error("Layer not found");
      }

      const baseFeature = {
        rowId,
        layerId,
        type: layer.type,
        title: row.cells.find((c) => c.columnId === layer.titleColumnId),
        description: row.cells.find(
          (c) => c.columnId === layer.descriptionColumnId,
        ),
        icon: row.cells.find((c) => c.columnId === layer.iconColumnId),
      };

      switch (layer.type) {
        case "point": {
          if (!layer.pointLayer) {
            throw new Error("Point layer not found");
          }
          return {
            ...baseFeature,
            feature: row.cells.find(
              (c) => c.columnId === layer.pointLayer?.pointColumnId,
            )?.pointCell,
            cells: row.cells.filter(
              (c) =>
                c.columnId !== layer.pointLayer?.pointColumnId &&
                c.columnId !== layer.titleColumnId &&
                c.columnId !== layer.descriptionColumnId &&
                c.columnId !== layer.iconColumnId,
            ),
          };
        }
        case "marker": {
          if (!layer.markerLayer) {
            throw new Error("Marker layer not found");
          }
          return {
            ...baseFeature,
            feature: row.cells.find(
              (c) => c.columnId === layer.markerLayer?.pointColumnId,
            )?.pointCell,
            cells: row.cells.filter(
              (c) =>
                c.columnId !== layer.markerLayer?.pointColumnId &&
                c.columnId !== layer.titleColumnId &&
                c.columnId !== layer.descriptionColumnId &&
                c.columnId !== layer.iconColumnId,
            ),
          };
        }
        case "line": {
          if (!layer.lineLayer) {
            throw new Error("Line layer not found");
          }
          return {
            ...baseFeature,
            feature: row.cells.find(
              (c) => c.columnId === layer.lineLayer?.lineColumnId,
            )?.lineCell,
            cells: row.cells.filter(
              (c) =>
                c.columnId !== layer.lineLayer?.lineColumnId &&
                c.columnId !== layer.titleColumnId &&
                c.columnId !== layer.descriptionColumnId &&
                c.columnId !== layer.iconColumnId,
            ),
          };
        }
        case "polygon": {
          if (!layer.polygonLayer) {
            throw new Error("Polygon layer not found");
          }
          return {
            ...baseFeature,
            feature: row.cells.find(
              (c) => c.columnId === layer.polygonLayer?.polygonColumnId,
            )?.polygonCell,
            cells: row.cells.filter(
              (c) =>
                c.columnId !== layer.polygonLayer?.polygonColumnId &&
                c.columnId !== layer.titleColumnId &&
                c.columnId !== layer.descriptionColumnId &&
                c.columnId !== layer.iconColumnId,
            ),
          };
        }
        default:
          throw new Error(`Unsupported layer type: ${layer.type}`);
      }
    });

export type GetLayerFeature = UnwrapReturn<typeof getLayerFeature>;
