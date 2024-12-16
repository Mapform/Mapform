"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { rows } from "@mapform/db/schema";
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
            pointCell: true,
            stringCell: true,
            numberCell: true,
            dateCell: true,
          },
        },
      },
    });
  });

export type Responses = UnwrapReturn<typeof getResponses>;
