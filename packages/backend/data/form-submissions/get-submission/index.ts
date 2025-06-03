"server-only";

import { db } from "@mapform/db";
import { eq, sql } from "@mapform/db/utils";
import {
  pointCells,
  formSubmissions,
  polygonCells,
  lineCells,
} from "@mapform/db/schema";
import type { PublicClient, UnwrapReturn } from "../../../lib/types";
import { getSubmissionSchema } from "./schema";

export const getSubmission = (authClient: PublicClient) =>
  authClient
    .schema(getSubmissionSchema)
    .action(async ({ parsedInput: { submissionId } }) => {
      const submission = await db.query.formSubmissions.findFirst({
        where: eq(formSubmissions.id, submissionId),
        with: {
          row: {
            with: {
              dataset: {
                columns: {
                  id: true,
                },
              },
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
                  lineCell: {
                    columns: {
                      id: true,
                    },
                    // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                    extras: {
                      coordinates: sql<
                        number[]
                      >`ST_AsText(${lineCells.value})`.as("coordinates"),
                    },
                  },
                  polygonCell: {
                    columns: {
                      id: true,
                    },
                    // TODO: Can remove this workaround once this is fixed: https://github.com/drizzle-team/drizzle-orm/pull/2778#issuecomment-2408519850
                    extras: {
                      coordinates: sql<
                        number[]
                      >`ST_AsText(${polygonCells.value})`.as("coordinates"),
                    },
                  },
                  stringCell: true,
                  numberCell: true,
                  dateCell: true,
                },
              },
            },
          },
        },
      });

      return submission;
    });

export type GetSubmission = UnwrapReturn<typeof getSubmission>;
