"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { datasets } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getDatasetSchema } from "./schema";

export const getDataset = authAction
  .schema(getDatasetSchema)
  .action(async ({ parsedInput: { datasetId } }) => {
    return db.query.datasets.findFirst({
      where: eq(datasets.id, datasetId),
      with: {
        columns: true,
        rows: {
          with: {
            cells: {
              with: {
                stringCell: true,
                booleanCell: true,
                pointCell: true,
                numberCell: true,
                dateCell: true,
              },
            },
          },
        },
        teamspace: {
          columns: {
            name: true,
          },
        },
      },
    });
  });

export type GetDataset = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getDataset>>>["data"]
>;
