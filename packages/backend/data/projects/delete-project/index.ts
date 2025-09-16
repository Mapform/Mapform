"server-only";

import { and, eq, inArray, or } from "@mapform/db/utils";
import { projects, rows, blobs } from "@mapform/db/schema";
import { deleteProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deleteProject = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteProjectSchema)
    .action(async ({ parsedInput: { projectId }, ctx: { user, db } }) => {
      const teamspaceIds = user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat();

      await db.transaction(async (tx) => {
        // Collect row ids for this project before cascade deletes them
        const projectRowIds = await tx
          .select({ id: rows.id })
          .from(rows)
          .where(eq(rows.projectId, projectId));

        const rowIdList = projectRowIds.map((r) => r.id);
        const now = new Date();

        // Queue blobs linked to this project or any of its rows
        await tx
          .update(blobs)
          .set({ queuedForDeletionDate: now })
          .where(
            rowIdList.length > 0
              ? or(
                  eq(blobs.projectId, projectId),
                  inArray(blobs.rowId, rowIdList),
                )
              : eq(blobs.projectId, projectId),
          );

        // Delete the project (rows will cascade)
        await tx
          .delete(projects)
          .where(
            and(
              eq(projects.id, projectId),
              inArray(projects.teamspaceId, teamspaceIds),
            ),
          );
      });
    });
