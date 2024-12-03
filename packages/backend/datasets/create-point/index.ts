import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  cells,
  layers,
  pointCells,
  richtextCells,
  rows,
  stringCells,
} from "@mapform/db/schema";
import type { DocumentContent } from "@mapform/blocknote";
import type { CreatePointSchema } from "./schema";

export const createPoint = async ({
  layerId,
  title,
  description,
  location,
}: CreatePointSchema) => {
  await db.transaction(async (tx) => {
    const layer = await tx.query.layers.findFirst({
      where: eq(layers.id, layerId),
      with: {
        pointLayer: true,
        markerLayer: true,
      },
    });

    if (!layer) {
      throw new Error("Layer not found");
    }

    if (layer.type !== "point" && layer.type !== "marker") {
      throw new Error("Layer is not a point or marker layer");
    }

    const pointColumnId =
      layer.type === "point"
        ? layer.pointLayer?.pointColumnId
        : layer.markerLayer?.pointColumnId;
    const titleColumnId =
      layer.type === "point"
        ? layer.pointLayer?.titleColumnId
        : layer.markerLayer?.titleColumnId;
    const descriptionColumnId =
      layer.type === "point"
        ? layer.pointLayer?.descriptionColumnId
        : layer.markerLayer?.descriptionColumnId;
    const iconColumnId =
      layer.type === "point"
        ? layer.pointLayer?.iconColumnId
        : layer.markerLayer?.iconColumnId;

    if (!titleColumnId) {
      throw new Error("Layer does not have a title column");
    }

    if (!descriptionColumnId) {
      throw new Error("Layer does not have a description column");
    }

    if (!pointColumnId) {
      throw new Error("Layer does not have a point column");
    }

    const [row] = await tx
      .insert(rows)
      .values({
        datasetId: layer.datasetId,
      })
      .returning();

    if (!row) {
      throw new Error("Row not created");
    }

    const [titleCell, descriptionCell, pointCell] = await tx
      .insert(cells)
      .values([
        {
          rowId: row.id,
          columnId: titleColumnId,
        },
        {
          rowId: row.id,
          columnId: descriptionColumnId,
        },
        {
          rowId: row.id,
          columnId: pointColumnId,
        },
        // If an icon column exists, create a cell for it, but we don't need to create an iconCell (just leave it empty)
        ...(iconColumnId
          ? [
              {
                rowId: row.id,
                columnId: iconColumnId,
              },
            ]
          : []),
      ])
      .returning();

    if (!titleCell || !descriptionCell || !pointCell) {
      throw new Error("Cells not created");
    }

    await tx.insert(stringCells).values({
      cellId: titleCell.id,
      value: title,
    });

    await tx.insert(richtextCells).values({
      cellId: descriptionCell.id,
      value: description as { content: DocumentContent },
    });

    await tx.insert(pointCells).values({
      cellId: pointCell.id,
      value: location,
    });
  });
};
