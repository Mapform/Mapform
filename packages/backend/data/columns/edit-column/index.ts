"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { editColumnSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const editColumn = (authClient: UserAuthClient) =>
  authClient
    .schema(editColumnSchema)
    .action(async ({ parsedInput: { id, name } }) => {
      const [col] = await db
        .update(columns)
        .set({ name })
        .where(eq(columns.id, id))
        .returning();

      return col;
    });
