"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { createRowSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";

export const createRow = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(createRowSchema)
    .action(async ({ parsedInput: { datasetId }, ctx: { userAccess } }) => {
      const [newRow] = await db
        .insert(rows)
        .values({
          datasetId,
        })
        .returning();

      return newRow;
    });
