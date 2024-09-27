"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  cells,
  pointCells,
  layersToPages,
  type PointCell,
} from "@mapform/db/schema";
import { action } from "~/lib/safe-action";
import { getPageDataSchema } from "./schema";

export const getPageData = action
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
      (ltp) => ltp.layer.pointLayer?.pointColumnId
    );

    const [pointCellsResponse] = await Promise.all(
      pointLayers.map((pl) =>
        db
          .select()
          .from(cells)
          .leftJoin(pointCells, eq(cells.id, pointCells.cellId))
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We are filtering for this above, it's a TS shortcoming
          .where(eq(cells.columnId, pl.layer.pointLayer!.pointColumnId))
      )
    );

    return {
      pointData: pointCellsResponse?.map((pc) => pc.point_cell) as PointCell[],
    };
  });

export type PageData = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getPageData>>>["data"]
>;
