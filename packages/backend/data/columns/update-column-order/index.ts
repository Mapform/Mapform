"server-only";

import { eq, and, inArray } from "@mapform/db/utils";
import { columns, projects } from "@mapform/db/schema";
import { updateColumnOrderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateColumnOrder = (authClient: UserAuthClient) =>
  authClient
    .schema(updateColumnOrderSchema)
    .action(
      async ({
        parsedInput: { projectId, columnOrder },
        ctx: { user, db },
      }) => {
        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Verify user has access to this project
        const project = await db.query.projects.findFirst({
          where: and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, teamspaceIds),
          ),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        // Verify all columns belong to this project
        const existingColumns = await db.query.columns.findMany({
          where: and(
            eq(columns.projectId, projectId),
            inArray(columns.id, columnOrder),
          ),
          columns: {
            id: true,
          },
        });

        if (existingColumns.length !== columnOrder.length) {
          throw new Error("Some columns not found or unauthorized");
        }

        // Update column positions in a transaction
        await db.transaction(async (tx) => {
          for (let i = 0; i < columnOrder.length; i++) {
            await tx
              .update(columns)
              .set({ position: i })
              .where(eq(columns.id, columnOrder[i]!));
          }
        });

        return { success: true };
      },
    );