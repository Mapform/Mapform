"server-only";

import { db } from "@mapform/db";
import { columns, datasets } from "@mapform/db/schema";
import { createEmptyDatasetSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const createEmptyDataset = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(createEmptyDatasetSchema)
    .action(
      async ({
        parsedInput: { name, teamspaceId, layerType },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.byId(teamspaceId)) {
          throw new Error("User does not have access to this teamspace.");
        }

        const response = await db.transaction(async (tx) => {
          let cols;
          const [ds] = await tx
            .insert(datasets)
            .values({
              name,
              teamspaceId,
            })
            .returning();

          if (layerType === "point" && ds) {
            cols = await tx
              .insert(columns)
              .values([
                {
                  datasetId: ds.id,
                  name: "Location",
                  type: "point",
                },
                {
                  datasetId: ds.id,
                  name: "Title",
                  type: "string",
                },
                {
                  datasetId: ds.id,
                  name: "Description",
                  type: "richtext",
                },
              ])
              .returning();
          }

          return {
            ds,
            cols,
          };
        });

        return {
          dataset: response.ds,
          columns: response.cols,
        };
      },
    );
