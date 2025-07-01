"server-only";

import { db, sql } from "@mapform/db";
import {
  mapViews,
  tableViews,
  projects,
  fileTreePositions,
} from "@mapform/db/schema";
import { createProjectSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { views } from "@mapform/db/schema/views/schema";
import { and, count, eq, isNull } from "@mapform/db/utils";

export const createProject = (authClient: UserAuthClient) =>
  authClient
    .schema(createProjectSchema)
    .action(
      async ({
        parsedInput: { teamspaceId, parentId, ...rest },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
          throw new Error("Unauthorized");
        }

        const [fileTreeCount] = await db
          .select({ count: count() })
          .from(fileTreePositions)
          .where(
            and(
              eq(fileTreePositions.teamspaceId, teamspaceId),
              ...(parentId
                ? [eq(fileTreePositions.id, parentId)]
                : [isNull(fileTreePositions.parentId)]),
            ),
          );

        console.log(1111, fileTreeCount);

        return db.transaction(async (tx) => {
          const [fileTreePosition] = await tx
            .insert(fileTreePositions)
            .values({
              teamspaceId,
              parentId,
              itemType: "project",
              position: fileTreeCount?.count ?? 0,
            })
            .returning();

          if (!fileTreePosition) {
            throw new Error("Failed to create file tree position");
          }

          /**
           * Create project
           */
          const [project] = await tx
            .insert(projects)
            .values({
              teamspaceId,
              fileTreePositionId: fileTreePosition.id,
            })
            .returning();

          if (!project) {
            throw new Error("Failed to create project");
          }

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
