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
import { getFeatureSchema } from "./schama";
import * as wellknown from "wellknown";
import type {
  FullGeoJsonLineString,
  FullGeoJsonPoint,
  FullGeoJsonPolygon,
} from "../types";

export const getFeature = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getFeatureSchema)
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
                    coordinates: sql<string>`ST_AsText(${lineCells.value})`.as(
                      "coordinates",
                    ),
                  },
                },
                polygonCell: {
                  columns: {
                    id: true,
                  },
                  extras: {
                    coordinates:
                      sql<string>`ST_AsText(${polygonCells.value})`.as(
                        "coordinates",
                      ),
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
          const pointCell = row.cells.find(
            (c) => c.columnId === layer.pointLayer?.pointColumnId,
          )?.pointCell;

          if (!pointCell || !layer.pointLayer.pointColumnId) {
            throw new Error("Point cell not found");
          }

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pointCell.x, pointCell.y],
            },
            properties: {
              id: `${rowId}_${layerId}`,
              rowId,
              cellId: pointCell.id,
              columnId: layer.pointLayer.pointColumnId,
              layerId,
              childLayerId: layer.pointLayer.id,
              layerType: layer.type,
              icon: baseFeature.icon?.iconCell?.value ?? null,
              color: layer.pointLayer.color ?? null,
              title: baseFeature.title?.stringCell?.value ?? null,
              description: baseFeature.description?.stringCell?.value ?? null,
              properties: row.cells
                .filter(
                  (c) =>
                    c.columnId !== layer.pointLayer?.pointColumnId &&
                    c.columnId !== layer.titleColumnId &&
                    c.columnId !== layer.descriptionColumnId &&
                    c.columnId !== layer.iconColumnId,
                )
                .reduce((acc, cell) => {
                  const value =
                    cell.stringCell?.value ??
                    cell.numberCell?.value ??
                    cell.booleanCell?.value ??
                    cell.dateCell?.value ??
                    cell.richtextCell?.value ??
                    cell.iconCell?.value ??
                    null;
                  return { ...acc, [cell.columnId]: value };
                }, {}),
            },
          } satisfies FullGeoJsonPoint;
        }
        case "marker": {
          if (!layer.markerLayer) {
            throw new Error("Marker layer not found");
          }
          const pointCell = row.cells.find(
            (c) => c.columnId === layer.markerLayer?.pointColumnId,
          )?.pointCell;

          if (!pointCell || !layer.markerLayer.pointColumnId) {
            throw new Error("Point cell not found");
          }

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pointCell.x, pointCell.y],
            },
            properties: {
              id: `${rowId}_${layerId}`,
              rowId,
              cellId: pointCell.id,
              columnId: layer.markerLayer.pointColumnId,
              layerId,
              childLayerId: layer.markerLayer.id,
              layerType: layer.type,
              icon: baseFeature.icon?.iconCell?.value ?? null,
              color: layer.markerLayer.color ?? null,
              title: baseFeature.title?.stringCell?.value ?? null,
              description: baseFeature.description?.stringCell?.value ?? null,
              properties: row.cells
                .filter(
                  (c) =>
                    c.columnId !== layer.markerLayer?.pointColumnId &&
                    c.columnId !== layer.titleColumnId &&
                    c.columnId !== layer.descriptionColumnId &&
                    c.columnId !== layer.iconColumnId,
                )
                .reduce((acc, cell) => {
                  const value =
                    cell.stringCell?.value ??
                    cell.numberCell?.value ??
                    cell.booleanCell?.value ??
                    cell.dateCell?.value ??
                    cell.richtextCell?.value ??
                    cell.iconCell?.value ??
                    null;
                  return { ...acc, [cell.columnId]: value };
                }, {}),
            },
          } satisfies FullGeoJsonPoint;
        }
        case "line": {
          if (!layer.lineLayer) {
            throw new Error("Line layer not found");
          }
          const lineCell = row.cells.find(
            (c) => c.columnId === layer.lineLayer?.lineColumnId,
          )?.lineCell;

          if (!lineCell || !layer.lineLayer.lineColumnId) {
            throw new Error("Line cell not found");
          }

          // Parse the WKT coordinates into GeoJSON format
          const geometry = wellknown.parse(lineCell.coordinates);
          if (!geometry || geometry.type !== "LineString") {
            throw new Error("Invalid line geometry");
          }

          return {
            type: "Feature",
            geometry,
            properties: {
              id: `${rowId}_${layerId}`,
              rowId,
              cellId: lineCell.id,
              columnId: layer.lineLayer.lineColumnId,
              layerId,
              childLayerId: layer.lineLayer.id,
              layerType: layer.type,
              icon: baseFeature.icon?.iconCell?.value ?? null,
              color: layer.color ?? null,
              title: baseFeature.title?.stringCell?.value ?? null,
              description: baseFeature.description?.stringCell?.value ?? null,
              properties: row.cells
                .filter(
                  (c) =>
                    c.columnId !== layer.lineLayer?.lineColumnId &&
                    c.columnId !== layer.titleColumnId &&
                    c.columnId !== layer.descriptionColumnId &&
                    c.columnId !== layer.iconColumnId,
                )
                .reduce((acc, cell) => {
                  const value =
                    cell.stringCell?.value ??
                    cell.numberCell?.value ??
                    cell.booleanCell?.value ??
                    cell.dateCell?.value ??
                    cell.richtextCell?.value ??
                    cell.iconCell?.value ??
                    null;
                  return { ...acc, [cell.columnId]: value };
                }, {}),
            },
          } satisfies FullGeoJsonLineString;
        }
        case "polygon": {
          if (!layer.polygonLayer) {
            throw new Error("Polygon layer not found");
          }
          const polygonCell = row.cells.find(
            (c) => c.columnId === layer.polygonLayer?.polygonColumnId,
          )?.polygonCell;

          if (!polygonCell || !layer.polygonLayer.polygonColumnId) {
            throw new Error("Polygon cell not found");
          }

          // Parse the WKT coordinates into GeoJSON format
          const geometry = wellknown.parse(polygonCell.coordinates);
          if (!geometry || geometry.type !== "Polygon") {
            throw new Error("Invalid polygon geometry");
          }

          return {
            type: "Feature",
            geometry,
            properties: {
              id: `${rowId}_${layerId}`,
              rowId,
              cellId: polygonCell.id,
              columnId: layer.polygonLayer.polygonColumnId,
              layerId,
              childLayerId: layer.polygonLayer.id,
              layerType: layer.type,
              icon: baseFeature.icon?.iconCell?.value ?? null,
              color: layer.color ?? null,
              title: baseFeature.title?.stringCell?.value ?? null,
              description: baseFeature.description?.stringCell?.value ?? null,
              properties: row.cells
                .filter(
                  (c) =>
                    c.columnId !== layer.polygonLayer?.polygonColumnId &&
                    c.columnId !== layer.titleColumnId &&
                    c.columnId !== layer.descriptionColumnId &&
                    c.columnId !== layer.iconColumnId,
                )
                .reduce((acc, cell) => {
                  const value =
                    cell.stringCell?.value ??
                    cell.numberCell?.value ??
                    cell.booleanCell?.value ??
                    cell.dateCell?.value ??
                    cell.richtextCell?.value ??
                    cell.iconCell?.value ??
                    null;
                  return { ...acc, [cell.columnId]: value };
                }, {}),
            },
          } satisfies FullGeoJsonPolygon;
        }
        default:
          throw new Error(`Unsupported layer type: ${layer.type}`);
      }
    });

export type GetFeature = UnwrapReturn<typeof getFeature>;
