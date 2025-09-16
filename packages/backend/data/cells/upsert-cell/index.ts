"server-only";

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
    .schema(upsertCellSchema)
    .action(
      async ({
        parsedInput: { rowId, columnId, columnName, type, value },
        ctx: { user, db },
      }) => {
        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Authorize row access and get its projectId
        const rowProject = await db
          .select({ projectId: rows.projectId })
          .from(rows)
          .leftJoin(projects, eq(projects.id, rows.projectId))
          .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
          .where(and(eq(rows.id, rowId), inArray(teamspaces.id, teamspaceIds)));

        if (!rowProject.length) {
          throw new Error("Unauthorized");
        }

        const projectId = rowProject[0]!.projectId;

        // Resolve column by id or name and ensure it belongs to the same project/teamspace
        const resolvedColumn = await db
          .select({ id: columns.id })
          .from(columns)
          .leftJoin(projects, eq(projects.id, columns.projectId))
          .leftJoin(teamspaces, eq(teamspaces.id, projects.teamspaceId))
          .where(
            and(
              columnId
                ? eq(columns.id, columnId)
                : eq(columns.name, columnName as string),
              eq(columns.projectId, projectId),
              inArray(teamspaces.id, teamspaceIds),
            ),
          );

        if (!resolvedColumn.length) {
          throw new Error("Column not found");
        }

        const resolvedColumnId = resolvedColumn[0]!.id;

        await db.transaction(async (tx) => {
          const [cell] = await tx
            .insert(cells)
            .values({
              rowId,
              columnId: resolvedColumnId,
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
