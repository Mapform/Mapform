"server-only";

import { db } from "@mapform/db";
import { projects } from "@mapform/db/schema";
import { createViewSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";
import { views } from "@mapform/db/schema/views/schema";

export const createView = (authClient: UserAuthClient) =>
  authClient
    .inputSchema(createViewSchema)
    .action(
      async ({ parsedInput: { projectId, ...rest }, ctx: { userAccess } }) => {
        const project = await db.query.projects.findFirst({
          where: eq(projects.id, projectId),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const [view] = await db
          .insert(views)
          .values({
            projectId,
            type: rest.viewType,
          })
          .returning();

        if (!view) {
          throw new Error("Failed to create view");
        }

        return view;
      },
    );
