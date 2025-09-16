"server-only";

import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { deleteColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deleteColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteColumnSchema)
    .action(async ({ parsedInput: { id }, ctx: { db } }) => {
      await db.delete(columns).where(eq(columns.id, id));
    });
