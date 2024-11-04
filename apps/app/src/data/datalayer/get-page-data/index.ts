"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { cells, pointCells, layersToPages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getPageDataSchema } from "./schema";

export const getPageData = authAction
  .schema(getPageDataSchema)
  .action(async ({ parsedInput: { pageId } }) => {
    const layersToPagesResponse = await db.query.layersToPages.findMany({
      where: eq(layersToPages.pageId, pageId),
      with: {
        layer: {
          with: {
            pointLayer: true,
          },
        },
      },
    });

    const pointLayers = layersToPagesResponse.filter(
      (ltp) => ltp.layer.pointLayer?.pointColumnId,
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
          pointLayerId: pl.layer.pointLayer.id,
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
          pointLayerId: pc.pointLayerId,
        })),
    };
  });

export type PageData = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPageData>>>["data"]
>;
