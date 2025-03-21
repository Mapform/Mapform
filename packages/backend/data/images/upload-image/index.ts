"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";
import { blobs } from "@mapform/db/schema";

export const uploadImage = (authClient: UserAuthClient) =>
  authClient
    .schema(uploadImageSchema)
    .action(
      async ({ parsedInput: { image, workspaceId }, ctx: { userAccess } }) => {
        if (!userAccess.workspace.checkAccessById(workspaceId)) {
          throw new Error("Unauthorized");
        }

        console.log(11111, image.size);

        const response = await db.transaction(async (tx) => {
          const putResponse = await put(`${workspaceId}/${image.name}`, image, {
            access: "public",
            addRandomSuffix: true,
          });

          await tx.insert(blobs).values({
            size: image.size,
            url: putResponse.url,
            workspaceId,
          });

          return putResponse;
        });

        return response;
      },
    );
