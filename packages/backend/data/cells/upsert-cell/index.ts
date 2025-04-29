"server-only";

import { db, sql } from "@mapform/db";
import {
  cells,
  numberCells,
  pointCells,
  stringCells,
  booleanCells,
  richtextCells,
  dateCells,
  iconsCells,
  rows,
  datasets,
  teamspaces,
  columns,
  lineCells,
  polygonCells,
} from "@mapform/db/schema";
import { and, eq, inArray } from "@mapform/db/utils";
import { upsertCellSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import type { DocumentContent } from "@mapform/blocknote";

export const upsertCell = (authClient: UserAuthClient) =>
  authClient
    .schema(upsertCellSchema)
    .action(
      async ({
        parsedInput: { rowId, columnId, type, value },
        ctx: { user },
      }) => {
        console.log("upsertCell", value);

        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Check to make sure the cell is part of a dataset the user has access to
        const [rowResult, columnResult] = await Promise.all([
          db
            .select()
            .from(rows)
            .leftJoin(datasets, eq(datasets.id, rows.datasetId))
            .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
            .where(
              and(eq(rows.id, rowId), inArray(teamspaces.id, teamspaceIds)),
            ),
          db
            .select()
            .from(columns)
            .leftJoin(datasets, eq(datasets.id, columns.datasetId))
            .leftJoin(teamspaces, eq(teamspaces.id, datasets.teamspaceId))
            .where(
              and(
                eq(columns.id, columnId),
                inArray(teamspaces.id, teamspaceIds),
              ),
            ),
        ]);

        if (!rowResult.length || !columnResult.length) {
          throw new Error("Unauthorized");
        }

        await db.transaction(async (tx) => {
          const [cell] = await tx
            .insert(cells)
            .values({
              rowId,
              columnId,
            })
            .onConflictDoUpdate({
              target: [cells.rowId, cells.columnId],
              set: { updatedAt: new Date() },
            })
            .returning();

          if (!cell) {
            throw new Error("Failed to create or update cell");
          }

          if (type === "string") {
            return tx
              .insert(stringCells)
              .values({
                cellId: cell.id,
                value: value || null,
              })
              .onConflictDoUpdate({
                target: stringCells.cellId,
                set: { value: value || null },
              });
          }

          if (type === "number") {
            return tx
              .insert(numberCells)
              .values({
                cellId: cell.id,
                value: value || null,
              })
              .onConflictDoUpdate({
                target: numberCells.cellId,
                set: { value: value || null },
              });
          }

          if (type === "bool") {
            return tx
              .insert(booleanCells)
              .values({
                cellId: cell.id,
                value,
              })
              .onConflictDoUpdate({
                target: booleanCells.cellId,
                set: { value },
              });
          }

          if (type === "point") {
            await tx
              .insert(pointCells)
              .values({
                cellId: cell.id,
                value,
              })
              .onConflictDoUpdate({
                target: pointCells.cellId,
                set: { value },
              });
          }

          if (type === "richtext") {
            await tx
              .insert(richtextCells)
              .values({
                cellId: cell.id,
                value: value as unknown as { content: DocumentContent },
              })
              .onConflictDoUpdate({
                target: richtextCells.cellId,
                set: {
                  value: value as unknown as { content: DocumentContent },
                },
              });
          }

          if (type === "date") {
            await tx
              .insert(dateCells)
              .values({
                cellId: cell.id,
                value,
              })
              .onConflictDoUpdate({
                target: dateCells.cellId,
                set: { value },
              });
          }

          if (type === "icon") {
            await tx
              .insert(iconsCells)
              .values({
                cellId: cell.id,
                value,
              })
              .onConflictDoUpdate({
                target: iconsCells.cellId,
                set: { value },
              });
          }

          if (type === "line") {
            await tx
              .insert(lineCells)
              .values({
                cellId: cell.id,
                value: sql.raw(`ST_GeomFromGeoJSON('{
                  "type": "LineString",
                  "coordinates": ${JSON.stringify(value?.coordinates ?? [])}
                }')`),
              })
              .onConflictDoUpdate({
                target: lineCells.cellId,
                set: {
                  value: sql.raw(`ST_GeomFromGeoJSON('{
                  "type": "LineString",
                  "coordinates": ${JSON.stringify(value?.coordinates ?? [])}
                }')`),
                },
              });
          }

          if (type === "polygon") {
            await tx
              .insert(polygonCells)
              .values({
                cellId: cell.id,
                value: sql.raw(
                  `ST_GeomFromGeoJSON('{
                    "type": "Polygon",
                    "coordinates": ${JSON.stringify(value?.coordinates ?? [])}
                  }')`,
                ),
              })
              .onConflictDoUpdate({
                target: polygonCells.cellId,
                set: {
                  value: sql.raw(
                    `ST_GeomFromGeoJSON('{
                    "type": "Polygon",
                    "coordinates": ${JSON.stringify(value?.coordinates ?? [])}
                  }')`,
                  ),
                },
              });
          }
        });
      },
    );
