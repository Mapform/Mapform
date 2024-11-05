"server-only";

import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { rows, pointLayers, pointCells } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getLayerPointSchema } from "./schema";

/**
 * Returns a single point (a row) from a point layer
 */
export const getLayerPoint = authAction
  .schema(getLayerPointSchema)
  .action(async ({ parsedInput: { rowId, pointLayerId } }) => {
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
      title: row.cells.find((c) => c.columnId === pointLayer.titleColumnId)
        ?.stringCell,
      description: row.cells.find(
        (c) => c.columnId === pointLayer.descriptionColumnId,
      )?.richtextCell,
      location: row.cells.find((c) => c.columnId === pointLayer.pointColumnId)
        ?.pointCell,
      cells: row.cells.filter(
        (c) =>
          c.columnId !== pointLayer.pointColumnId &&
          c.columnId !== pointLayer.titleColumnId &&
          c.columnId !== pointLayer.descriptionColumnId,
      ),
    };
  });
