"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { updateImageSchema } from "./schema";
import { blobs } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";

export const updateImage = (authClient: UserAuthClient) =>
  authClient
    .schema(updateImageSchema)
    .action(
      async ({
        parsedInput: { url, workspaceId, queuedForDeletionDate },
        ctx: { userAccess },
      }) => {
        if (!userAccess.workspace.checkAccessById(workspaceId)) {
          throw new Error("Unauthorized");
        }

        return db
          .update(blobs)
          .set({
            queuedForDeletionDate,
          })
          .where(eq(blobs.url, url));
      },
    );
