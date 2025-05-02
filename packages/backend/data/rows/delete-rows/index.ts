"server-only";

import { db } from "@mapform/db";
import { rows } from "@mapform/db/schema";
import { deleteRowsSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { inArray } from "@mapform/db/utils";

export const deleteRows = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteRowsSchema)
    .action(async ({ parsedInput: { rowIds } }) => {
      return db.delete(rows).where(inArray(rows.id, rowIds)).returning({
        id: rows.id,
      });
    });
