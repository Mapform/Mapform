"server-only";

import { db } from "@mapform/db";
import { datasets, rows } from "@mapform/db/schema";
import { createRowSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { getRowAndPageCount } from "../../usage/get-row-and-page-count";
import { eq } from "@mapform/db/utils";

export const createRow = (authClient: UserAuthClient) =>
  authClient
    .schema(createRowSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      const existingDataset = await db.query.datasets.findFirst({
        where: eq(datasets.id, datasetId),
        with: {
          teamspace: {
            columns: {
              id: true,
              slug: true,
              workspaceSlug: true,
            },
          },
        },
      });

      if (!existingDataset) {
        throw new Error("Dataset not found.");
      }

      if (!userAccess.teamspace.checkAccessById(existingDataset.teamspace.id)) {
        throw new Error("Unauthorized.");
      }

      const response = await getRowAndPageCount(authClient)({
        workspaceSlug: existingDataset.teamspace.workspaceSlug,
      });
      const rowCount = response?.data?.rowCount;
      const pageCount = response?.data?.pageCount;

      if (rowCount === undefined || pageCount === undefined) {
        throw new Error("Row count or page count is undefined.");
      }

      const [newRow] = await db
        .insert(rows)
        .values({
          datasetId,
        })
        .returning();

      return newRow;
    });
