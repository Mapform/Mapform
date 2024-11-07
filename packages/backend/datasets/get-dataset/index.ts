import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { datasets, pointCells } from "@mapform/db/schema";
import { type GetDatasetSchema } from "./schema";

export const getDataset = async ({ datasetId }: GetDatasetSchema) => {
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
                // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                extras: {
                  x: sql<number>`ST_X(${pointCells.value})`.as("x"),
                  y: sql<number>`ST_Y(${pointCells.value})`.as("y"),
                },
              },
              numberCell: true,
              dateCell: true,
              richtextCell: true,
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
};

export type GetDataset = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getDataset>>>
>;
