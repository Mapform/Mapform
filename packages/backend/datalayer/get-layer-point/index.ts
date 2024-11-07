import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { rows, pointLayers, pointCells } from "@mapform/db/schema";
import { type GetLayerPointSchema } from "./schema";

/**
 * Returns a single point (a row) from a point layer
 */
export const getLayerPoint = async ({
  rowId,
  pointLayerId,
}: GetLayerPointSchema) => {
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
    location: row.cells.find((c) => c.columnId === pointLayer.pointColumnId),
    cells: row.cells.filter(
      (c) =>
        c.columnId !== pointLayer.pointColumnId &&
        c.columnId !== pointLayer.titleColumnId &&
        c.columnId !== pointLayer.descriptionColumnId,
    ),
  };
};

export type GetLayerPoint = Awaited<ReturnType<typeof getLayerPoint>>;
