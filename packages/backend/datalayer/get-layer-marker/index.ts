import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { rows, pointCells, markerLayers } from "@mapform/db/schema";
import { type GetLayerMarkerSchema } from "./schema";

/**
 * Returns a single point (a row) from a marker layer
 */
export const getLayerMarker = async ({
  rowId,
  markerLayerId,
}: GetLayerMarkerSchema) => {
  const [markerLayer, row] = await Promise.all([
    db.query.markerLayers.findFirst({
      where: eq(markerLayers.id, markerLayerId),
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

  if (!markerLayer) {
    throw new Error("Marker layer not found");
  }

  return {
    rowId,
    markerLayerId,
    title: row.cells.find((c) => c.columnId === markerLayer.titleColumnId),
    description: row.cells.find(
      (c) => c.columnId === markerLayer.descriptionColumnId,
    ),
    location: row.cells.find((c) => c.columnId === markerLayer.pointColumnId),
    icon: row.cells.find((c) => c.columnId === markerLayer.iconColumnId),
    cells: row.cells.filter(
      (c) =>
        c.columnId !== markerLayer.pointColumnId &&
        c.columnId !== markerLayer.titleColumnId &&
        c.columnId !== markerLayer.descriptionColumnId,
    ),
  };
};

export type GetLayerMarker = Awaited<ReturnType<typeof getLayerMarker>>;
