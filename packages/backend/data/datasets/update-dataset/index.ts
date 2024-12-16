"server-only";

import { db } from "@mapform/db";
import { datasets } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";
import { updateDatasetSchema } from "./schema";

export const updateDataset = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(updateDatasetSchema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { userAccess } }) => {
      const existingDataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, id),
      });

      if (!existingDataset) {
        throw new Error("Dataset not found.");
      }

      if (!userAccess.teamspace.checkAccessById(existingDataset.teamspaceId)) {
        throw new Error("Unauthorized.");
      }

      return db
        .update(datasets)
        .set(rest)
        .where(eq(datasets.id, id))
        .returning();
    });
