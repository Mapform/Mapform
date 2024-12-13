"server-only";

import { db } from "@mapform/db";
import {
  pointCells,
  cells,
  iconsCells,
  layersToPages,
  pages,
  projects,
} from "@mapform/db/schema";
import { and, eq, or, inArray } from "@mapform/db/utils";
import { getPageDataSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { publicOrUserAuthMiddleware } from "../../../lib/middleware";

export const getPageData = (authClient: AuthClient) =>
  authClient
    .use(publicOrUserAuthMiddleware)
    .schema(getPageDataSchema)
    .action(async ({ parsedInput: { pageId }, ctx }) => {
      if (ctx.authType === "public") {
        // TODO
      }

      if (ctx.authType === "user") {
        const teamspaceIds = ctx.user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        const result = await db
          .select()
          .from(pages)
          .leftJoin(projects, eq(projects.id, pages.projectId))
          .where(
            and(
              eq(pages.id, pageId),
              inArray(projects.teamspaceId, teamspaceIds),
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

      const pointCellsResponse = await Promise.all(
        pointLayers.map(async (pl) => {
          if (!pl.layer.pointLayer?.pointColumnId || !pl.layer.pointLayer.id) {
            return [];
          }

          const cellsResponse = await db
            .select()
            .from(cells)
            .leftJoin(pointCells, eq(cells.id, pointCells.cellId))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We are filtering for this above, it's a TS shortcoming
            .where(eq(cells.columnId, pl.layer.pointLayer!.pointColumnId));

          return cellsResponse.map((c) => ({
            ...c,
            color: pl.layer.pointLayer?.color,
            rowId: c.cell.rowId,
            pointLayerId: pl.layer.pointLayer?.id,
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
            pointLayerId: pl.layer.markerLayer?.id,
          }));
        }),
      );

      return {
        pointData: pointCellsResponse
          .flat()
          .filter((pc) => pc.point_cell?.value)
          .map((pc) => ({
            ...pc.point_cell,
            color: pc.color,
            rowId: pc.rowId,
            cellId: pc.cell.id,
            columnId: pc.cell.columnId,
            pointLayerId: pc.pointLayerId,
          })),

        markerData: markerCellsResponse
          .flat()
          .filter((pc) => pc.point_cell?.value)
          .map((pc) => ({
            ...pc.point_cell,
            icon: pc.icon_cell?.value,
            color: pc.color,
            rowId: pc.rowId,
            cellId: pc.cell.id,
            columnId: pc.cell.columnId,
            pointLayerId: pc.pointLayerId,
          })),
      };
    });

export type PageData = UnwrapReturn<typeof getPageData>;
