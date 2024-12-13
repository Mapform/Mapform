"server-only";

import { db } from "@mapform/db";
import { datasets } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";
import { deleteDatasetSchema } from "./schema";

export const deleteDataset = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(deleteDatasetSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      const dataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, datasetId),
        with: {
          teamspace: {
            columns: {
              slug: true,
            },
          },
        },
      });

      if (!dataset) {
        throw new Error("Dataset not found");
      }

      if (!userAccess.teamspace.bySlug(dataset.teamspace.slug)) {
        throw new Error("Unauthorized");
      }

      return db.delete(datasets).where(eq(datasets.id, datasetId));
    });
