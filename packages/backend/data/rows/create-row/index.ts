"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { createRowSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const createRow = (authClient: UserAuthClient) =>
  authClient
    .schema(createRowSchema)
    .action(async ({ parsedInput: { datasetId } }) => {
      const [newRow] = await db
        .insert(rows)
        .values({
          datasetId,
        })
        .returning();

      return newRow;
    });
