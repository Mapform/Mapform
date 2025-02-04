"server-only";

import { db } from "@mapform/db";
import { datasets } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { UserAuthClient } from "../../../lib/types";
import { deleteDatasetSchema } from "./schema";
import { ServerError } from "../../../lib/server-error";

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
          project: {
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

      if (dataset.project) {
        throw new ServerError(
          "Cannot delete a project's submissions dataset. To delete this dataset the project must be deleted first.",
        );
      }

      await db.delete(datasets).where(eq(datasets.id, datasetId));
    });
