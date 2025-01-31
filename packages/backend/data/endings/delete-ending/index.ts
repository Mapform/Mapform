"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { deleteEndingSchema } from "./schema";
import { endings } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";

export const deleteEnding = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteEndingSchema)
    .action(async ({ parsedInput: { endingId }, ctx: { userAccess } }) => {
      const ending = await db.query.endings.findFirst({
        where: eq(endings.id, endingId),
        with: {
          project: true,
        },
      });

      if (!ending) {
        throw new Error("Ending not found");
      }

      if (!userAccess.teamspace.checkAccessById(ending.project.teamspaceId)) {
        throw new Error("Unauthorized");
      }

      await db.delete(endings).where(eq(endings.id, endingId));
    });
