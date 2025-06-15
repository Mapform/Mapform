"server-only";

import { db } from "@mapform/db";
import { mapViews, tableViews, projects, teamspaces } from "@mapform/db/schema";
import { createProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const createProject = (authClient: UserAuthClient) =>
  authClient
    .schema(createProjectSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, ...rest },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const teamspace = await db.query.teamspaces.findFirst({
          where: eq(teamspaces.id, teamspaceId),
          with: {
            workspace: {
              with: {
                plan: true,
              },
            },
          },
        });

        if (!teamspace) {
          throw new Error("Teamspace not found");
        }

        return db.transaction(async (tx) => {
          /**
           * Create project
           */
          const [project] = await tx
            .insert(projects)
            .values({
              teamspaceId,
            })
            .returning();

          if (!project) {
            throw new Error("Failed to create project");
          }

          if (rest.viewType === "table") {
            await tx.insert(tableViews).values({
              projectId: project.id,
            });
          } else if (rest.viewType === "map") {
            await tx.insert(mapViews).values({
              projectId: project.id,
            });
          }

          return project;
        });
      },
    );
