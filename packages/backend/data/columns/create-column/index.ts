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

        const projectColumns = await db.query.columns.findMany({
          where: eq(columns.projectId, projectId),
        });

        let columnName = name;
        let i = 1;
        while (projectColumns.some((c) => c.name === columnName)) {
          columnName = `${name} ${i}`;
          i++;
        }

        const [newColumn] = await db
          .insert(columns)
          .values({
            name: columnName,
            projectId,
            type,
            position: projectColumns.length,
          })
          .returning();

        return newColumn;
      },
    );
