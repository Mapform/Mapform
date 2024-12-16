"server-only";

import { db } from "@mapform/db";
import { datasets } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { UserAuthClient } from "../../../lib/types";
import { deleteDatasetSchema } from "./schema";

export const deleteDataset = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteDatasetSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      const dataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, datasetId),
        with: {
          teamspace: {
            columns: {
              id: true,
            },
          },
        },
      });

      if (!dataset) {
        throw new Error("Dataset not found");
      }

      if (!userAccess.teamspace.checkAccessById(dataset.teamspace.id)) {
        throw new Error("Unauthorized");
      }

      return db.delete(datasets).where(eq(datasets.id, datasetId));
    });
