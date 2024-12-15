"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { columns } from "@mapform/db/schema";
import { editColumnSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddleware } from "../../../lib/middleware";

export const editColumn = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddleware)
    .schema(editColumnSchema)
    .action(async ({ parsedInput: { id, name }, ctx: { userAccess } }) => {
      const [col] = await db
        .update(columns)
        .set({ name })
        .where(eq(columns.id, id))
        .returning();

      return col;
    });
