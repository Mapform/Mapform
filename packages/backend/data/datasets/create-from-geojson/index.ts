"server-only";

import { db } from "@mapform/db";
import { v4 as uuidv4 } from "uuid";
import {
  datasets,
  columns,
  rows,
  cells,
  stringCells,
  booleanCells,
  numberCells,
  pointCells,
  dateCells,
  Column,
} from "@mapform/db/schema";
import type { GeoJson } from "@infra-blocks/zod-utils/geojson";
import { createDatasetFromGeojsonSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";
import { prepCell } from "./prep-cell";

export const createDatasetFromGeojson = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(createDatasetFromGeojsonSchema)
    .action(async ({ parsedInput: { name, teamspaceId, data } }) => {
      const cellsToCreateByRow = getCellsToCreateByRow(data).map((row) => ({
        cells: row,
        rowdId: uuidv4(),
      }));

      // Group cells by key
      const groupedCells = cellsToCreateByRow
        .map((c) => c.cells)
        .flat()
        .reduce(
          (acc, current) => {
            const identifier = `${current.type}-${current.key}`; // Create a unique identifier

            if (!acc.set.has(identifier)) {
              acc.set.add(identifier); // Track this combination
              // @ts-ignore -- It's ok
              acc.result.push(current); // Add object to the result array
            }

            return acc;
          },
          { set: new Set(), result: [] },
        ).result as {
        key: string;
        type: Column["type"];
      }[];

      const datasetResponse = await db.transaction(async (tx) => {
        /**
         * Create Dataset
         */
        const [dataset] = await tx
          .insert(datasets)
          .values({
            name,
            teamspaceId,
          })
          .returning();

        if (!dataset) {
          throw new Error("Could not create dataset");
        }

        const [datasetCols] = await Promise.all([
          tx
            .insert(columns)
            .values(
              groupedCells.map((cell) => ({
                name: cell.key,
                type: cell.type,
                datasetId: dataset.id,
              })),
            )
            .returning(),
          tx
            .insert(rows)
            .values(
              cellsToCreateByRow.map((row) => ({
                id: row.rowdId,
                datasetId: dataset.id,
              })),
            )
            .returning(),
        ]);

        await tx
          .insert(cells)
          .values(
            cellsToCreateByRow
              .map((row) =>
                row.cells.map((cell) => ({
                  id: cell.id,
                  rowId: row.rowdId,
                  columnId: datasetCols.find((col) => col.name === cell.key)!
                    .id,
                  value: cell.value,
                })),
              )
              .flat(),
          )
          .returning();

        const flatCells = cellsToCreateByRow.flatMap((row) => row.cells);

        /**
         * Insert cells
         */
        const dsStringCells = flatCells.filter(
          (cell) => cell.type === "string",
        );
        const dsBoolCells = flatCells.filter((cell) => cell.type === "bool");
        const dsDateCells = flatCells.filter((cell) => cell.type === "date");
        const dsNumberCells = flatCells.filter(
          (cell) => cell.type === "number",
        );
        const dsPointCells = flatCells.filter((cell) => cell.type === "point");

        await Promise.all([
          /**
           * Insert StringCells
           */
          dsStringCells.length &&
            tx.insert(stringCells).values(
              dsStringCells.map((cell) => ({
                cellId: cell.id,
                value: cell.value as string,
              })),
            ),

          /**
           * Insert BoolCells
           */
          dsBoolCells.length &&
            tx.insert(booleanCells).values(
              dsBoolCells.map((cell) => ({
                cellId: cell.id,
                value: cell.value as boolean,
              })),
            ),

          /**
           * Insert DateCells
           */
          dsDateCells.length &&
            tx.insert(dateCells).values(
              dsDateCells.map((cell) => ({
                cellId: cell.id,
                value: cell.value as unknown as Date,
              })),
            ),

          /**
           * Insert NumberCells
           */
          dsNumberCells.length &&
            tx.insert(numberCells).values(
              // @ts-ignore -- It's ok
              dsNumberCells.map((cell) => ({
                cellId: cell.id,
                value: cell.value,
              })),
            ),

          /**
           * Insert PointCells
           */
          dsPointCells.length &&
            tx.insert(pointCells).values(
              dsPointCells.map((cell) => ({
                cellId: cell.id,
                value: {
                  // @ts-ignore -- It's ok
                  x: cell.value.coordinates[0],
                  // @ts-ignore -- It's ok
                  y: cell.value.coordinates[1],
                },
              })),
            ),
        ]);

        return {
          dataset,
          columns: datasetCols,
        };
      });

      return datasetResponse;
    });

function getCellsToCreateByRow(data: GeoJson) {
  if (data.type === "FeatureCollection") {
    return data.features.map((row) => prepCell(row));
  } else if (data.type === "Feature") {
    return [prepCell(data)];
  } else if (data.type === "GeometryCollection") {
    return data.geometries.map((row) =>
      prepCell({ type: "Feature", geometry: row, properties: {} }),
    );
  }

  return [prepCell({ type: "Feature", geometry: data, properties: {} })];
}
