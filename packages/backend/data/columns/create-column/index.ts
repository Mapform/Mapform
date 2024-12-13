"server-only";

import { db } from "@mapform/db";
import { columns, datasets } from "@mapform/db/schema";
import { createColumnSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";
import { and, eq, inArray } from "@mapform/db/utils";

export const createColumn = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(createColumnSchema)
    .action(
      async ({ parsedInput: { name, datasetId, type }, ctx: { user } }) => {
        const teamspaceIds = user.workspaceMemberships
          .map((m) => m.workspace.teamspaces.map((t) => t.id))
          .flat();

        // Only allow creating columns in datasets that belong to the user's teamspace
        const dataset = await db.query.datasets.findFirst({
          where: and(
            eq(datasets.id, datasetId),
            inArray(datasets.teamspaceId, teamspaceIds),
          ),
        });

        if (!dataset) {
          throw new Error("Dataset not found");
        }

        const [newColumn] = await db
          .insert(columns)
          .values({
            name,
            datasetId,
            type,
          })
          .returning();

        return newColumn;
      },
    );
