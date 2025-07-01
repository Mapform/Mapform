"server-only";

import { db, sql } from "@mapform/db";
import { mapViews, tableViews, projects, teamspaces } from "@mapform/db/schema";
import { createProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";
import { views } from "@mapform/db/schema/views/schema";

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

          console.log("Project created", project);

          const [view] = await tx
            .insert(views)
            .values({
              projectId: project.id,
              type: rest.viewType,
            })
            .returning();

          if (!view) {
            throw new Error("Failed to create view");
          }

          if (rest.viewType === "table") {
            await tx.insert(tableViews).values({
              viewId: view.id,
            });
          } else if (rest.viewType === "map") {
            await tx.insert(mapViews).values({
              viewId: view.id,
              center: sql.raw(`ST_GeomFromGeoJSON('{
                "type": "Point",
                "coordinates": ${JSON.stringify([0, 0])}
              }')`),
            });
          }

          return project;
        });
      },
    );
