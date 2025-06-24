"server-only";

import { db } from "@mapform/db";
import {
  cells,
  numberCells,
  stringCells,
  booleanCells,
  dateCells,
  rows,
  teamspaces,
  columns,
  projects,
} from "@mapform/db/schema";
import { and, eq, inArray } from "@mapform/db/utils";
import { upsertCellSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const upsertCell = (authClient: UserAuthClient) =>
  authClient
    .inputSchema(upsertCellSchema)
    .action(
      async ({
        parsedInput: { rowId, columnId, type, value },
        ctx: { user },
      }) => {
        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Check to make sure the cell is part of a project the user has access to
        const [rowResult, columnResult] = await Promise.all([
          db
            .select()
            .from(rows)
            .leftJoin(projects, eq(projects.id, rows.projectId))
            .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
            .where(
              and(eq(rows.id, rowId), inArray(teamspaces.id, teamspaceIds)),
            ),
          db
            .select()
            .from(columns)
            .leftJoin(projects, eq(projects.id, columns.projectId))
            .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
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
        });
      },
    );
