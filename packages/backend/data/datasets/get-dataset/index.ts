"server-only";

import { db } from "@mapform/db";
import { eq, sql, and, inArray } from "@mapform/db/utils";
import { getDatasetSchema } from "./schema";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";
import { datasets, pointCells } from "@mapform/db/schema";

export const getDataset = (authClient: UserAuthClient) =>
  authClient
    .schema(getDatasetSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      return db.query.datasets.findFirst({
        where: and(
          eq(datasets.id, datasetId),
          inArray(datasets.teamspaceId, userAccess.teamspace.ids),
        ),
        with: {
          columns: true,
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
          rows: {
            with: {
              formSubmission: true,
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
