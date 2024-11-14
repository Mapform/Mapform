"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { shareClient } from "~/lib/safe-action";
import { getResponsesSchema } from "./schema";

/**
 * Returns a session's previous responses
 */
export const getResponses = shareClient
  .schema(getResponsesSchema)
  .action(async ({ parsedInput: { id } }) => {
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

export type Responses = NonNullable<
  Awaited<ReturnType<typeof getResponses>>
>["data"];
