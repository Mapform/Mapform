"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { createEndingSchema } from "./schema";
import { endings, projects } from "@mapform/db/schema";
import { and, eq, inArray } from "@mapform/db/utils";

export const createEnding = (authClient: UserAuthClient) =>
  authClient
    .schema(createEndingSchema)
    .action(
      async ({
        parsedInput: { projectId, endingType, ...rest },
        ctx: { userAccess },
      }) => {
        const project = await db.query.projects.findFirst({
          where: and(
            eq(projects.id, projectId),
            inArray(projects.teamspaceId, userAccess.teamspace.ids),
          ),
          with: {
            ending: true,
          },
        });

        if (!project) {
          throw new Error("Unauthorized");
        }

        if (project.ending) {
          throw new Error("Project already has an ending");
        }

        await db.insert(endings).values({
          projectId,
          endingType,
          ...rest,
        });
      },
    );
