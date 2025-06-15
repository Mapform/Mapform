"server-only";

import { db } from "@mapform/db";
import { columns, projects } from "@mapform/db/schema";
import { createColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, eq, inArray } from "@mapform/db/utils";

export const createColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(createColumnSchema)
    .action(
      async ({ parsedInput: { name, projectId, type }, ctx: { user } }) => {
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

        const [newColumn] = await db
          .insert(columns)
          .values({
            name,
            projectId,
            type,
          })
          .returning();

        return newColumn;
      },
    );
