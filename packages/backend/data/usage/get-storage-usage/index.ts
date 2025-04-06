"server-only";

import { db } from "@mapform/db";
import { blobs, workspaces } from "@mapform/db/schema";
import { and, eq, isNull, sum } from "@mapform/db/utils";
import { getStorageUsageSchema } from "./schema";
import type { UserAuthClient, PublicClient } from "../../../lib/types";

export const getStorageUsage = (authClient: UserAuthClient | PublicClient) =>
  authClient
    .schema(getStorageUsageSchema)
    .action(async ({ parsedInput: { workspaceSlug }, ctx }) => {
      if (
        ctx.authType === "user" &&
        !ctx.userAccess.workspace.checkAccessBySlug(workspaceSlug)
      ) {
        throw new Error("Unauthorized");
      }

      const [response] = await db
        .select({ totalSize: sum(blobs.size).mapWith(Number) })
        .from(blobs)
        .leftJoin(workspaces, eq(workspaces.slug, workspaceSlug))
        .where(
          and(
            eq(workspaces.id, blobs.workspaceId),
            isNull(blobs.queuedForDeletionDate),
          ),
        );

      return {
        totalStorageBytes: response?.totalSize ?? 0,
      };
    });
