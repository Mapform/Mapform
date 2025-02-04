"server-only";

import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import { pointCells, rows } from "@mapform/db/schema";
import type { PublicClient, UnwrapReturn } from "../../../lib/types";
import { getResponsesSchema } from "./schema";

export const getResponses = (authClient: PublicClient) =>
  authClient.schema(getResponsesSchema).action(({ parsedInput: { id } }) => {
    return db.query.rows.findFirst({
      where: eq(rows.id, id),
      with: {
        cells: {
          with: {
            column: true,
            booleanCell: true,
            // pointCell: true,
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
            stringCell: true,
            numberCell: true,
            dateCell: true,
          },
        },
      },
    });
  });

export type Responses = UnwrapReturn<typeof getResponses>;
