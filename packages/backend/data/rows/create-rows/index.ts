"server-only";

import { db } from "@mapform/db";
import { projects, rows } from "@mapform/db/schema";
import { createRowsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { getRowCount } from "../../usage/get-row-count";
import { eq } from "@mapform/db/utils";
import { ServerError } from "../../../lib/server-error";

export const createRows = (authClient: UserAuthClient) =>
  authClient
    .schema(createRowsSchema)
    .action(
      async ({
        parsedInput: { projectId, rows: rowsToInsert },
        ctx: { userAccess },
      }) => {
        const existingProject = await db.query.projects.findFirst({
          where: eq(projects.id, projectId),
          with: {
            teamspace: {
              columns: {
                id: true,
                slug: true,
                workspaceSlug: true,
              },
              with: {
                workspace: {
                  with: {
                    plan: {
                      columns: {
                        rowLimit: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!existingProject) {
          throw new Error("Project not found.");
        }

        if (
          !userAccess.teamspace.checkAccessById(existingProject.teamspace.id)
        ) {
          throw new Error("Unauthorized.");
        }

        const response = await getRowCount(authClient)({
          workspaceSlug: existingProject.teamspace.workspaceSlug,
        });
        const rowCount = response?.data;

        if (rowCount === undefined) {
          throw new Error("Row count or page count is undefined.");
        }

        if (rowCount >= existingProject.teamspace.workspace.plan!.rowLimit) {
          throw new ServerError(
            "Row limit exceeded. Delete some rows, or upgrade your plan.",
          );
        }

        const [newRow] = await db
          .insert(rows)
          .values(
            rowsToInsert.map((r) => ({
              projectId,
              name: r.name,
              icon: r.icon,
              geometry: r.geometry,
            })),
          )
          .returning();

        return newRow;
      },
    );
