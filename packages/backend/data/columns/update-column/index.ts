"server-only";

import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { updateColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(updateColumnSchema)
    .action(async ({ parsedInput: { id, name }, ctx: { db } }) => {
      const [col] = await db
        .update(columns)
        .set({ name })
        .where(eq(columns.id, id))
        .returning();

      return col;
    });
