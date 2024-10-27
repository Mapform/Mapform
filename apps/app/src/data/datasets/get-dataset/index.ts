"server-only";

import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { datasets, pointCells } from "@mapform/db/schema";
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
                pointCell: {
                  columns: {
                    id: true,
                  },
                  extras: {
                    x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                    y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                  },
                },
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
