"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { deleteEndingSchema } from "./schema";
import { endings, projects } from "@mapform/db/schema";
import { and, eq, inArray } from "@mapform/db/utils";

export const deleteEnding = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteEndingSchema)
    .action(
      async ({ parsedInput: { endingId, ...rest }, ctx: { userAccess } }) => {
        // TODO VALIDATION

        await db.delete(endings).where(eq(endings.id, endingId));
      },
    );
