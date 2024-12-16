"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { deleteRowsSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";
import { inArray } from "@mapform/db/utils";

export const deleteRows = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(deleteRowsSchema)
    .action(async ({ parsedInput: { rowIds }, ctx: { userAccess } }) => {
      return db.delete(rows).where(inArray(rows.id, rowIds));
    });
