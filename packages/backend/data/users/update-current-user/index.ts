"server-only";

import { eq } from "@mapform/db/utils";
import { users } from "@mapform/db/schema";
import { updateCurrentUserSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const updateCurrentUser = (authClient: UserAuthClient) =>
  authClient
    .schema(updateCurrentUserSchema)
    .action(async ({ parsedInput, ctx: { user, db } }) => {
      return db
        .update(users)
        .set(parsedInput)
        .where(eq(users.id, user.id))
        .returning();
    });
