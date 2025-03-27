"server-only";

import { db } from "@mapform/db";
import { eq, and, sql } from "@mapform/db/utils";
import { pointCells, projects, rows } from "@mapform/db/schema";
import type { PublicClient } from "../../../lib/types";
import { getSessionSchema } from "./schema";

export const getSession = (authClient: PublicClient) =>
  authClient
    .schema(getSessionSchema)
    .action(async ({ parsedInput: { rowId, projectId } }) => {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      if (!project.datasetId) {
        throw new Error("Project has no submissionsdataset.");
      }

      if (project.visibility === "closed") {
        throw new Error("Project is closed, the session cannot be accessed.");
      }

      const row = await db.query.rows.findFirst({
        where: and(eq(rows.id, rowId), eq(rows.datasetId, project.datasetId)),
        with: {
          cells: {
            with: {
              column: true,
              booleanCell: true,
              // pointCell: true,
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
              stringCell: true,
              numberCell: true,
              dateCell: true,
            },
          },
        },
      });

      return row;
    });
