"server-only";

import { db } from "@mapform/db";
import type { UserAuthClient } from "../../../lib/types";
import { uploadImageSchema } from "./schema";
import { put } from "@vercel/blob";
import { blobs, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { ServerError } from "../../../lib/server-error";
import { getStorageUsage } from "../../usage/get-storage-usage";

export const uploadImage = (authClient: UserAuthClient) =>
  authClient
    .schema(uploadImageSchema)
    .action(
      async ({ parsedInput: { image, workspaceId }, ctx: { userAccess } }) => {
        if (!userAccess.workspace.checkAccessById(workspaceId)) {
          throw new Error("Unauthorized");
        }

        // Get workspace slug for storage check
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, workspaceId),
          with: {
            plan: true,
          },
        });

        if (!workspace || !workspace.plan) {
          throw new Error("Workspace or plan not found");
        }

        // Check current storage usage
        const storageResponse = await getStorageUsage(authClient)({
          workspaceSlug: workspace.slug,
        });

        const currentStorageBytes = storageResponse?.data?.totalStorageBytes;
        if (currentStorageBytes === undefined) {
          throw new Error("Could not determine current storage usage");
        }

        // Check if uploading this image would exceed the storage limit
        if (currentStorageBytes + image.size > workspace.plan.storageLimit) {
          throw new ServerError(
            "Storage limit exceeded. Delete some images or upgrade your plan.",
          );
        }

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
