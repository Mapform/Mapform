"server-only";

import { sql } from "@mapform/db";
import { mapViews, tableViews, projects } from "@mapform/db/schema";
import { createProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { views } from "@mapform/db/schema/views/schema";
import { count, eq } from "@mapform/db/utils";

export const createProject = (authClient: UserAuthClient) =>
  authClient
    .schema(createProjectSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, center, viewType, ...rest },
        ctx: { userAccess, db },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const [projectCount] = await db
          .select({ count: count() })
          .from(projects)
          .where(eq(projects.teamspaceId, teamspaceId));

        return db.transaction(async (tx) => {
          /**
           * Create project
           */
          const [project] = await tx
            .insert(projects)
            .values({
              ...rest,
              teamspaceId,
              position: projectCount?.count ?? 0,
              center: sql.raw(`ST_GeomFromGeoJSON('{
                "type": "Point",
                "coordinates": ${JSON.stringify(center)}
              }')`),
            })
            .returning();

          if (!project) {
            throw new Error("Failed to create project");
          }

          const [view] = await tx
            .insert(views)
            .values({
              projectId: project.id,
              type: viewType,
            })
            .returning();

          if (!view) {
            throw new Error("Failed to create view");
          }

          if (viewType === "table") {
            await tx.insert(tableViews).values({
              viewId: view.id,
            });
          } else if (viewType === "map") {
            await tx.insert(mapViews).values({
              viewId: view.id,
            });
          }

          return project;
        });
      },
    );
