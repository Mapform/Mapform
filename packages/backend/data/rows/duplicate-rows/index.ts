"server-only";

import { db, sql } from "@mapform/db";
import { eq, inArray } from "@mapform/db/utils";
import {
  rows,
  cells,
  stringCells,
  booleanCells,
  dateCells,
  numberCells,
  plans,
} from "@mapform/db/schema";
import { duplicateRowsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";
import { getRowCount } from "../../usage/get-row-count";

export const duplicateRows = (authClient: UserAuthClient) =>
  authClient
    .schema(duplicateRowsSchema)
    .action(async ({ parsedInput: { rowIds }, ctx: { userAccess } }) => {
      const dataToDuplicate = await db.query.rows.findMany({
        where: inArray(rows.id, rowIds),
        extras: {
          geometry: sql<string>`ST_AsGeoJSON(${rows.geometry})::jsonb`.as(
            "geometry",
          ),
        },
        with: {
          cells: {
            with: {
              stringCell: true,
              numberCell: true,
              booleanCell: true,
              dateCell: true,
            },
          },
          project: {
            with: {
              teamspace: {
                columns: {
                  id: true,
                  workspaceSlug: true,
                },
              },
            },
          },
        },
      });

      if (dataToDuplicate.length === 0) {
        throw new Error("No rows found to duplicate");
      }

      const teamspace = dataToDuplicate[0]?.project.teamspace;

      // Validate that all rows are from the same teamspace
      if (
        !teamspace ||
        dataToDuplicate.some((row) => row.project.teamspace.id !== teamspace.id)
      ) {
        throw new Error("Rows must be from the same teamspace");
      }

      // Check if user has access to the teamspace
      dataToDuplicate.forEach((row) => {
        if (!userAccess.teamspace.checkAccessById(row.project.teamspace.id)) {
          throw new Error("Unauthorized");
        }
      });

      const [plan, counts] = await Promise.all([
        db.query.plans.findFirst({
          where: eq(plans.workspaceSlug, teamspace.workspaceSlug),
        }),
        getRowCount(authClient)({
          workspaceSlug: teamspace.workspaceSlug,
        }),
      ]);

      const rowCount = counts?.data;

      if (!plan) {
        throw new Error("Plan not found.");
      }

      if (rowCount === undefined) {
        throw new Error("Row count is undefined.");
      }

      if (rowCount + dataToDuplicate.length > plan.rowLimit) {
        throw new ServerError(
          "Row limit exceeded. Delete some rows, or upgrade your plan.",
        );
      }

      await db.transaction(async (tx) => {
        const duplicatedRowIds = await tx
          .insert(rows)
          .values(
            dataToDuplicate.map((row) => {
              return {
                name: row.name,
                icon: row.icon,
                description: row.description,
                projectId: row.projectId,
                geometry: row.geometry,
              };
            }),
          )
          .returning();

        // Map new rows to old rows
        const rowIdMap: Record<string, string> = Object.fromEntries(
          duplicatedRowIds.map((row, index) => [rowIds[index], row.id]),
        );

        const cellsToDuplicate = dataToDuplicate.flatMap((row) => row.cells);

        const duplicatedCells =
          cellsToDuplicate.length > 0 &&
          (await tx
            .insert(cells)
            .values(
              cellsToDuplicate.map((cell) => {
                return {
                  rowId: rowIdMap[cell.rowId]!,
                  columnId: cell.columnId,
                };
              }),
            )
            .returning());

        const cellIdMap: Record<string, string> = duplicatedCells
          ? Object.fromEntries(
              cellsToDuplicate.map((cell, index) => [
                cell.id,
                duplicatedCells[index]!.id,
              ]),
            )
          : {};

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

        await Promise.all([
          stringCellsToDuplicate.length > 0 &&
            tx.insert(stringCells).values(
              cellsToDuplicate
                .filter((cell) => cell.stringCell)
                .map((cell) => {
                  return {
                    cellId: cellIdMap[cell.id]!,
                    value: cell.stringCell!.value,
                  };
                }),
            ),

          booleanCellsToDuplicate.length > 0 &&
            tx.insert(booleanCells).values(
              cellsToDuplicate
                .filter((cell) => cell.booleanCell)
                .map((cell) => {
                  return {
                    cellId: cellIdMap[cell.id]!,
                    value: cell.booleanCell!.value,
                  };
                }),
            ),

          dateCellsToDuplicate.length > 0 &&
            tx.insert(dateCells).values(
              cellsToDuplicate
                .filter((cell) => cell.dateCell)
                .map((cell) => {
                  return {
                    cellId: cellIdMap[cell.id]!,
                    value: cell.dateCell!.value,
                  };
                }),
            ),

          numberCellsToDuplicate.length > 0 &&
            tx.insert(numberCells).values(
              cellsToDuplicate
                .filter((cell) => cell.numberCell)
                .map((cell) => {
                  return {
                    cellId: cellIdMap[cell.id]!,
                    value: cell.numberCell!.value,
                  };
                }),
            ),
        ]);

        return duplicatedRowIds;
      });
    });
