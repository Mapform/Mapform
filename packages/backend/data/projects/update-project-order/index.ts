"server-only";

import { db } from "@mapform/db";
import { eq, and, inArray } from "@mapform/db/utils";
import { projects } from "@mapform/db/schema";
import { updateProjectOrderSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateProjectOrder = (authClient: UserAuthClient) =>
  authClient
    .schema(updateProjectOrderSchema)
    .action(
      async ({ parsedInput: { teamspaceId, projectOrder }, ctx: { user } }) => {
        const userTeamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Verify user has access to this teamspace
        if (!userTeamspaceIds.includes(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        // Verify all projects belong to this teamspace
        const existingProjects = await db.query.projects.findMany({
          where: and(
            eq(projects.teamspaceId, teamspaceId),
            inArray(projects.id, projectOrder),
          ),
          columns: {
            id: true,
          },
        });

        if (existingProjects.length !== projectOrder.length) {
          throw new Error("Some projects not found or unauthorized");
        }

        // Update project positions in a transaction
        await db.transaction(async (tx) => {
          for (let i = 0; i < projectOrder.length; i++) {
            await tx
              .update(projects)
              .set({ position: i })
              .where(eq(projects.id, projectOrder[i]!));
          }
        });

        return { success: true };
      },
    );
