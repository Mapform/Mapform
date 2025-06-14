"server-only";

import { db } from "@mapform/db";
import { columns, datasets } from "@mapform/db/schema";
import { createEmptyDatasetSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const createEmptyDataset = (authClient: UserAuthClient) =>
  authClient
    .schema(createEmptyDatasetSchema)
    .action(
      async ({
        parsedInput: { name, teamspaceId, layerType },
        ctx: { userAccess },
      }) => {
        if (!userAccess.teamspace.checkAccessById(teamspaceId)) {
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
                {
                  datasetId: ds.id,
                  name: "Icon",
                  type: "icon",
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
