"server-only";

import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { getDatasetSchema } from "./schema";
import type { AuthClient, UnwrapReturn } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";
import { datasets, pointCells } from "@mapform/db/schema";

export const getDataset = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(getDatasetSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
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
                  iconCell: true,
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

export type GetDataset = UnwrapReturn<typeof getDataset>;
