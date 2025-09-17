"server-only";

import { columns, projects } from "@mapform/db/schema";
import { createColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, count, eq, inArray } from "@mapform/db/utils";

export const createColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(createColumnSchema)
    .action(
      async ({ parsedInput: { name, projectId, type }, ctx: { user, db } }) => {
        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Only allow creating columns in projects that belong to the user's teamspace
        const project = await db.query.projects.findFirst({
          where: and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, teamspaceIds),
          ),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        const [projectCount] = await db
          .select({ count: count() })
          .from(columns)
          .where(eq(columns.projectId, projectId));

        const [newColumn] = await db
          .insert(columns)
          .values({
            name,
            projectId,
            type,
            position: projectCount?.count ?? 0,
          })
          .returning();

        return newColumn;
      },
    );
