"server-only";

import { db } from "@mapform/db";
import { inArray, sql } from "@mapform/db/utils";
import {
  pointCells,
  rows,
  cells,
  stringCells,
  booleanCells,
  dateCells,
  richtextCells,
  numberCells,
} from "@mapform/db/schema";
import { duplicateRowsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const duplicateRows = (authClient: UserAuthClient) =>
  authClient
    .schema(duplicateRowsSchema)
    .action(async ({ parsedInput: { rowIds } }) => {
      const dataToDuplicate = await db.query.rows.findMany({
        where: inArray(rows.id, rowIds),
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
      });

      if (dataToDuplicate.length === 0) {
        throw new Error("No rows found to duplicate");
      }

      await db.transaction(async (tx) => {
        const duplicatedRowIds = await tx
          .insert(rows)
          .values(
            dataToDuplicate.map((row) => {
              return {
                datasetId: row.datasetId,
              };
            }),
          )
          .returning();

        // Map new rows to old rows
        const rowIdMap: Record<string, string> = Object.fromEntries(
          duplicatedRowIds.map((row, index) => [rowIds[index], row.id]),
        );

        const cellsToDuplicate = dataToDuplicate.flatMap((row) => row.cells);

        const duplicatedCells = await tx
          .insert(cells)
          .values(
            cellsToDuplicate.map((cell) => {
              return {
                rowId: rowIdMap[cell.rowId]!,
                columnId: cell.columnId,
              };
            }),
          )
          .returning();

        const cellIdMap: Record<string, string> = Object.fromEntries(
          cellsToDuplicate.map((cell, index) => [
            cell.id,
            duplicatedCells[index]!.id,
          ]),
        );

        const pointCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.pointCell,
        );
        const stringCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.stringCell,
        );
        const booleanCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.booleanCell,
        );
        const dateCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.dateCell,
        );
        const numberCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.numberCell,
        );
        const richtextCellsToDuplicate = cellsToDuplicate.filter(
          (cell) => cell.richtextCell,
        );

        if (pointCellsToDuplicate.length > 0) {
          await tx.insert(pointCells).values(
            pointCellsToDuplicate.map((cell) => {
              return {
                cellId: cellIdMap[cell.id]!,
                value: {
                  x: cell.pointCell!.x,
                  y: cell.pointCell!.y,
                },
              };
            }),
          );
        }

        if (stringCellsToDuplicate.length > 0) {
          await tx.insert(stringCells).values(
            cellsToDuplicate
              .filter((cell) => cell.stringCell)
              .map((cell) => {
                return {
                  cellId: cellIdMap[cell.id]!,
                  value: cell.stringCell!.value,
                };
              }),
          );
        }

        if (booleanCellsToDuplicate.length > 0) {
          await tx.insert(booleanCells).values(
            cellsToDuplicate
              .filter((cell) => cell.booleanCell)
              .map((cell) => {
                return {
                  cellId: cellIdMap[cell.id]!,
                  value: cell.booleanCell!.value,
                };
              }),
          );
        }

        if (dateCellsToDuplicate.length > 0) {
          await tx.insert(dateCells).values(
            cellsToDuplicate
              .filter((cell) => cell.dateCell)
              .map((cell) => {
                return {
                  cellId: cellIdMap[cell.id]!,
                  value: cell.dateCell!.value,
                };
              }),
          );
        }

        if (numberCellsToDuplicate.length > 0) {
          await tx.insert(numberCells).values(
            cellsToDuplicate
              .filter((cell) => cell.numberCell)
              .map((cell) => {
                return {
                  cellId: cellIdMap[cell.id]!,
                  value: cell.numberCell!.value,
                };
              }),
          );
        }

        if (richtextCellsToDuplicate.length) {
          await tx.insert(richtextCells).values(
            cellsToDuplicate
              .filter((cell) => cell.richtextCell)
              .map((cell) => {
                return {
                  cellId: cellIdMap[cell.id]!,
                  value: cell.richtextCell!.value,
                };
              }),
          );
        }

        return duplicatedRowIds;
      });
    });
