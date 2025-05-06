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
} from "@mapform/db/schema";
import { and, eq, or, inArray, sql } from "@mapform/db/utils";
import { getFeaturesSchema } from "./schema";
import type {
  UserAuthClient,
  UnwrapReturn,
  PublicClient,
} from "../../../lib/types";
import * as wellknown from "wellknown";
import type { BaseProperties, FullFeatureCollection } from "../types";

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
              markerLayer: true,
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

      const markerLayers = layersToPagesResponse.filter(
        (ltp) =>
          ltp.layer.type === "marker" && ltp.layer.markerLayer?.pointColumnId,
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
            .where(eq(cells.columnId, pl.layer.pointLayer.pointColumnId));

          return cellsResponse.map((c) => ({
            ...c,
            color: pl.layer.pointLayer?.color,
            rowId: c.cell.rowId,
            pointLayerId: pl.layer.pointLayer?.id,
            layerId: pl.layer.id,
          }));
        }),
      );

      const markerCellsResponse = await Promise.all(
        markerLayers.map(async (pl) => {
          if (
            !pl.layer.markerLayer?.pointColumnId ||
            !pl.layer.markerLayer.id
          ) {
            return [];
          }

          const cellsResponse = await db
            .select()
            .from(cells)
            .leftJoin(pointCells, eq(cells.id, pointCells.cellId))
            .leftJoin(iconsCells, eq(cells.id, iconsCells.cellId))
            .where(
              or(
                eq(cells.columnId, pl.layer.markerLayer!.pointColumnId),
                pl.layer.markerLayer.iconColumnId
                  ? eq(cells.columnId, pl.layer.markerLayer.iconColumnId)
                  : undefined,
              ),
            );

          const groupedCells = cellsResponse.reduce(
            (acc, c) => {
              acc[c.cell.rowId] = {
                ...acc[c.cell.rowId],
                ...(c.point_cell ? { point_cell: c.point_cell } : {}),
                ...(c.icon_cell ? { icon_cell: c.icon_cell } : {}),
                cell: c.cell,
              };

              return acc;
            },
            {} as Record<
              string,
              {
                point_cell?: (typeof cellsResponse)[number]["point_cell"];
                icon_cell?: (typeof cellsResponse)[number]["icon_cell"];
                cell: (typeof cellsResponse)[number]["cell"];
              }
            >,
          );

          return Object.values(groupedCells).map((c) => ({
            ...c,
            color: pl.layer.markerLayer?.color,
            rowId: c.cell.rowId,
            columnId: c.cell.columnId,
            pointLayerId: pl.layer.markerLayer?.id,
            layerId: pl.layer.id,
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
            })
            .from(cells)
            .leftJoin(lineCells, eq(cells.id, lineCells.cellId))
            .where(eq(cells.columnId, ll.layer.lineLayer.lineColumnId));

          return cellsResponse.map((c) => ({
            ...c,
            color: ll.layer.color,
            rowId: c.cell.rowId,
            columnId: c.cell.columnId,
            lineLayerId: ll.layer.lineLayer?.id,
            layerId: ll.layer.id,
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
            })
            .from(cells)
            .leftJoin(polygonCells, eq(cells.id, polygonCells.cellId))
            .where(eq(cells.columnId, pl.layer.polygonLayer.polygonColumnId));

          return cellsResponse.map((c) => ({
            ...c,
            color: pl.layer.color,
            rowId: c.cell.rowId,
            columnId: c.cell.columnId,
            polygonLayerId: pl.layer.polygonLayer?.id,
            layerId: pl.layer.id,
          }));
        }),
      );

      const features = [
        ...pointCellsResponse
          .flat()
          .filter((pc) => pc.point_cell?.value)
          .map((pc) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pc.point_cell.x, pc.point_cell.y],
            },
            properties: {
              id: `${pc.rowId}_${pc.layerId}`,
              rowId: pc.rowId,
              cellId: pc.cell.id,
              columnId: pc.cell.columnId,
              layerId: pc.layerId,
              childLayerId: pc.pointLayerId,
              layerType: "point",
              icon: null,
              color: pc.color ?? null,
              title: null,
            } satisfies BaseProperties,
          })),

        ...markerCellsResponse
          .flat()
          .filter((pc) => pc.point_cell?.value)
          .map((pc) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pc.point_cell.x, pc.point_cell.y],
            },
            properties: {
              id: `${pc.rowId}_${pc.layerId}`,
              rowId: pc.rowId,
              cellId: pc.cell.id,
              columnId: pc.cell.columnId,
              layerId: pc.layerId,
              childLayerId: pc.pointLayerId,
              layerType: "marker",
              icon: pc.icon_cell?.value ?? null,
              color: pc.color ?? null,
              title: null,
            } satisfies BaseProperties,
          })),

        ...lineCellsResponse
          .flat()
          .filter((lc) => lc.line_cell?.value)
          .map((lc) => {
            const geometry = wellknown.parse(lc.line_cell.value);
            return {
              type: "Feature",
              geometry,
              properties: {
                id: `${lc.rowId}_${lc.layerId}`,
                rowId: lc.rowId,
                cellId: lc.cell.id,
                columnId: lc.cell.columnId,
                layerId: lc.layerId,
                childLayerId: lc.lineLayerId,
                layerType: "line",
                icon: null,
                color: lc.color ?? null,
                title: null,
              } satisfies BaseProperties,
            };
          }),

        ...polygonCellsResponse
          .flat()
          .filter((pc) => pc.polygon_cell?.value)
          .map((pc) => {
            const geometry = wellknown.parse(pc.polygon_cell.value);
            return {
              type: "Feature",
              geometry,
              properties: {
                id: `${pc.rowId}_${pc.layerId}`,
                rowId: pc.rowId,
                cellId: pc.cell.id,
                columnId: pc.cell.columnId,
                layerId: pc.layerId,
                childLayerId: pc.polygonLayerId,
                layerType: "polygon",
                icon: null,
                color: pc.color,
                title: null,
              } satisfies BaseProperties,
            };
          }),
      ];

      return {
        type: "FeatureCollection",
        features,
      } satisfies FullFeatureCollection;
    });

export type GetPageData = UnwrapReturn<typeof getFeatures>;
