"server-only";

import { db } from "@mapform/db";
import {
  pointCells,
  cells,
  iconsCells,
  layersToPages,
  pages,
  projects,
  lineCells,
  polygonCells,
  stringCells,
} from "@mapform/db/schema";
import { and, eq, or, inArray, sql } from "@mapform/db/utils";
import { getFeaturesSchema } from "./schema";
import type {
  UserAuthClient,
  UnwrapReturn,
  PublicClient,
} from "../../../lib/types";
import * as wellknown from "wellknown";
import type {
  BaseGeoJsonLineString,
  BaseGeoJsonPolygon,
  BaseProperties,
  BaseFeatureCollection,
} from "../types";

/**
 * Returns feature summaries, organized by layer type, for a given page.
 */
export const getFeatures = (authClient: PublicClient | UserAuthClient) =>
  authClient
    .schema(getFeaturesSchema)
    .action(async ({ parsedInput: { pageId }, ctx }) => {
      if (ctx.authType === "user") {
        const result = await db
          .select()
          .from(pages)
          .leftJoin(projects, eq(projects.id, pages.projectId))
          .where(
            and(
              eq(pages.id, pageId),
              inArray(projects.teamspaceId, ctx.userAccess.teamspace.ids),
            ),
          );

        if (!result.length) {
          throw new Error("Page not found");
        }
      }

      const layersToPagesResponse = await db.query.layersToPages.findMany({
        where: eq(layersToPages.pageId, pageId),
        with: {
          layer: {
            with: {
              pointLayer: true,
              lineLayer: true,
              polygonLayer: true,
            },
          },
        },
      });

      const pointLayers = layersToPagesResponse.filter(
        (ltp) =>
          ltp.layer.type === "point" && ltp.layer.pointLayer?.pointColumnId,
      );

      const lineLayers = layersToPagesResponse.filter(
        (ltp) => ltp.layer.type === "line" && ltp.layer.lineLayer?.lineColumnId,
      );

      const polygonLayers = layersToPagesResponse.filter(
        (ltp) =>
          ltp.layer.type === "polygon" &&
          ltp.layer.polygonLayer?.polygonColumnId,
      );

      const pointCellsResponse = await Promise.all(
        pointLayers.map(async (pl) => {
          if (!pl.layer.pointLayer?.pointColumnId || !pl.layer.pointLayer.id) {
            return [];
          }

          const cellsResponse = await db
            .select()
            .from(cells)
            .leftJoin(pointCells, eq(cells.id, pointCells.cellId))
            .leftJoin(iconsCells, eq(cells.id, iconsCells.cellId))
            .leftJoin(stringCells, eq(cells.id, stringCells.cellId))
            .where(
              or(
                eq(cells.columnId, pl.layer.pointLayer.pointColumnId),
                pl.layer.iconColumnId
                  ? eq(cells.columnId, pl.layer.iconColumnId)
                  : undefined,
                pl.layer.titleColumnId
                  ? eq(cells.columnId, pl.layer.titleColumnId)
                  : undefined,
              ),
            );

          const groupedCells = cellsResponse.reduce(
            (acc, c) => {
              acc[c.cell.rowId] = {
                ...acc[c.cell.rowId],
                ...(c.point_cell ? { point_cell: c.point_cell } : {}),
                ...(c.icon_cell ? { icon_cell: c.icon_cell } : {}),
                ...(c.string_cell ? { string_cell: c.string_cell } : {}),
                cell: c.cell,
              };

              return acc;
            },
            {} as Record<
              string,
              {
                point_cell?: (typeof cellsResponse)[number]["point_cell"];
                icon_cell?: (typeof cellsResponse)[number]["icon_cell"];
                string_cell?: (typeof cellsResponse)[number]["string_cell"];
                cell: (typeof cellsResponse)[number]["cell"];
              }
            >,
          );

          return Object.values(groupedCells).map((c) => ({
            ...c,
            color: pl.layer.color,
            rowId: c.cell.rowId,
            pointLayerId: pl.layer.pointLayer?.id,
            point_cell: c.point_cell,
            layerId: pl.layer.id,
            icon: pl.layer.iconColumnId
              ? {
                  value: c.icon_cell?.value ?? null,
                  columnId: pl.layer.iconColumnId,
                }
              : null,
            title: pl.layer.titleColumnId
              ? {
                  value: c.string_cell?.value ?? null,
                  columnId: pl.layer.titleColumnId,
                }
              : null,
          }));
        }),
      );

      const lineCellsResponse = await Promise.all(
        lineLayers.map(async (ll) => {
          if (!ll.layer.lineLayer?.lineColumnId || !ll.layer.lineLayer.id) {
            return [];
          }

          const cellsResponse = await db
            .select({
              cell: cells,
              line_cell: {
                ...lineCells,
                value: sql`ST_AsText(${lineCells.value})`.as("value"),
              },
              icon_cell: iconsCells,
              string_cell: stringCells,
            })
            .from(cells)
            .leftJoin(lineCells, eq(cells.id, lineCells.cellId))
            .leftJoin(stringCells, eq(cells.id, stringCells.cellId))
            .leftJoin(iconsCells, eq(cells.id, iconsCells.cellId))
            .where(
              or(
                eq(cells.columnId, ll.layer.lineLayer.lineColumnId),
                ll.layer.iconColumnId
                  ? eq(cells.columnId, ll.layer.iconColumnId)
                  : undefined,
                ll.layer.titleColumnId
                  ? eq(cells.columnId, ll.layer.titleColumnId)
                  : undefined,
              ),
            );

          const groupedCells = cellsResponse.reduce(
            (acc, c) => {
              acc[c.cell.rowId] = {
                ...acc[c.cell.rowId],
                ...(c.line_cell ? { line_cell: c.line_cell } : {}),
                ...(c.icon_cell ? { icon_cell: c.icon_cell } : {}),
                ...(c.string_cell ? { string_cell: c.string_cell } : {}),
                cell: c.cell,
              };

              return acc;
            },
            {} as Record<
              string,
              {
                line_cell?: (typeof cellsResponse)[number]["line_cell"];
                icon_cell?: (typeof cellsResponse)[number]["icon_cell"];
                string_cell?: (typeof cellsResponse)[number]["string_cell"];
                cell: (typeof cellsResponse)[number]["cell"];
              }
            >,
          );

          return Object.values(groupedCells).map((c) => ({
            ...c,
            color: ll.layer.color,
            rowId: c.cell.rowId,
            columnId: c.cell.columnId,
            lineLayerId: ll.layer.lineLayer?.id,
            line_cell: c.line_cell,
            layerId: ll.layer.id,
            icon: ll.layer.iconColumnId
              ? {
                  value: c.icon_cell?.value ?? null,
                  columnId: ll.layer.iconColumnId,
                }
              : null,
            title: ll.layer.titleColumnId
              ? {
                  value: c.string_cell?.value ?? null,
                  columnId: ll.layer.titleColumnId,
                }
              : null,
          }));
        }),
      );

      const polygonCellsResponse = await Promise.all(
        polygonLayers.map(async (pl) => {
          if (
            !pl.layer.polygonLayer?.polygonColumnId ||
            !pl.layer.polygonLayer.id
          ) {
            return [];
          }

          const cellsResponse = await db
            .select({
              cell: cells,
              polygon_cell: {
                ...polygonCells,
                value: sql`ST_AsText(${polygonCells.value})`.as("value"),
              },
              icon_cell: iconsCells,
              string_cell: stringCells,
            })
            .from(cells)
            .leftJoin(polygonCells, eq(cells.id, polygonCells.cellId))
            .leftJoin(stringCells, eq(cells.id, stringCells.cellId))
            .leftJoin(iconsCells, eq(cells.id, iconsCells.cellId))
            .where(
              or(
                eq(cells.columnId, pl.layer.polygonLayer.polygonColumnId),
                pl.layer.iconColumnId
                  ? eq(cells.columnId, pl.layer.iconColumnId)
                  : undefined,
                pl.layer.titleColumnId
                  ? eq(cells.columnId, pl.layer.titleColumnId)
                  : undefined,
              ),
            );

          const groupedCells = cellsResponse.reduce(
            (acc, c) => {
              acc[c.cell.rowId] = {
                ...acc[c.cell.rowId],
                ...(c.polygon_cell ? { polygon_cell: c.polygon_cell } : {}),
                ...(c.icon_cell ? { icon_cell: c.icon_cell } : {}),
                ...(c.string_cell ? { string_cell: c.string_cell } : {}),
                cell: c.cell,
              };

              return acc;
            },
            {} as Record<
              string,
              {
                polygon_cell?: (typeof cellsResponse)[number]["polygon_cell"];
                icon_cell?: (typeof cellsResponse)[number]["icon_cell"];
                string_cell?: (typeof cellsResponse)[number]["string_cell"];
                cell: (typeof cellsResponse)[number]["cell"];
              }
            >,
          );

          return Object.values(groupedCells).map((c) => ({
            ...c,
            color: pl.layer.color,
            rowId: c.cell.rowId,
            columnId: c.cell.columnId,
            polygonLayerId: pl.layer.polygonLayer?.id,
            polygon_cell: c.polygon_cell,
            layerId: pl.layer.id,
            icon: pl.layer.iconColumnId
              ? {
                  value: c.icon_cell?.value ?? null,
                  columnId: pl.layer.iconColumnId,
                }
              : null,
            title: pl.layer.titleColumnId
              ? {
                  value: c.string_cell?.value ?? null,
                  columnId: pl.layer.titleColumnId,
                }
              : null,
          }));
        }),
      );

      const features = [
        ...pointCellsResponse
          .flat()
          .filter(
            (pc) =>
              pc.point_cell?.value?.x !== undefined &&
              pc.point_cell.value.y !== undefined,
          )
          .map((pc) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pc.point_cell?.value?.x, pc.point_cell?.value?.y],
            },
            id: `${pc.rowId}_${pc.layerId}`,
            properties: {
              rowId: pc.rowId,
              cellId: pc.cell.id,
              columnId: pc.cell.columnId,
              layerId: pc.layerId,
              childLayerId: pc.pointLayerId,
              layerType: "point",
              color: pc.color ?? null,
              icon: pc.icon,
              title: pc.title,
            } satisfies BaseProperties,
          })),

        ...lineCellsResponse
          .flat()
          .filter((lc) => lc.line_cell?.value)
          .map((lc) => {
            const geometry = wellknown.parse(lc.line_cell?.value);
            if (!geometry || geometry.type !== "LineString") {
              return null;
            }

            return {
              type: "Feature",
              geometry,
              id: `${lc.rowId}_${lc.layerId}`,
              properties: {
                rowId: lc.rowId,
                cellId: lc.cell.id,
                columnId: lc.cell.columnId,
                layerId: lc.layerId,
                childLayerId: lc.lineLayerId,
                layerType: "line",
                color: lc.color ?? null,
                icon: lc.icon,
                title: lc.title,
              },
            } satisfies BaseGeoJsonLineString;
          }),

        ...polygonCellsResponse
          .flat()
          .filter((pc) => pc.polygon_cell?.value)
          .map((pc) => {
            const geometry = wellknown.parse(pc.polygon_cell?.value);
            if (!geometry || geometry.type !== "Polygon") {
              return null;
            }

            return {
              type: "Feature",
              geometry,
              id: `${pc.rowId}_${pc.layerId}`,
              properties: {
                rowId: pc.rowId,
                cellId: pc.cell.id,
                columnId: pc.cell.columnId,
                layerId: pc.layerId,
                childLayerId: pc.polygonLayerId,
                layerType: "polygon",
                color: pc.color,
                icon: pc.icon,
                title: pc.title,
              },
            } satisfies BaseGeoJsonPolygon;
          }),
      ];

      return {
        type: "FeatureCollection",
        features,
      } satisfies BaseFeatureCollection;
    });

export type GetFeatures = UnwrapReturn<typeof getFeatures>;
