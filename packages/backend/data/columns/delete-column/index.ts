"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { deleteColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deleteColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteColumnSchema)
    .action(async ({ parsedInput: { id } }) => {
      await db.delete(columns).where(eq(columns.id, id));
    });
