"server-only";

import type { UserAuthClient } from "../../../lib/types";
import { deleteImageSchema } from "./schema";
import { del } from "@vercel/blob";
import { blobs, projects } from "@mapform/db/schema";
import { and, eq, gt, isNotNull } from "@mapform/db/utils";
import { sql } from "@mapform/db";

/**
 * Immediate image deletion method. For delayed deltion (for example, if using
 * images in RichText editor where we want undo functionality), better to use
 * `updateImage` and set `queuedForDeletionDate`. This will all the
 * cleanup-blobs cron cleanup the blobs later on.
 */
export const deleteImage = (authClient: UserAuthClient) =>
  authClient
    .schema(deleteImageSchema)
    .action(async ({ parsedInput: { url }, ctx: { userAccess, db } }) => {
      const blob = await db.query.blobs.findFirst({
        where: eq(blobs.url, url),
      });

      if (!blob) {
        throw new Error("Blob not found");
      }

      if (!userAccess.workspace.checkAccessById(blob.workspaceId)) {
        throw new Error("Unauthorized");
      }

      if (blob.projectId) {
        const project = await db.query.projects.findFirst({
          where: eq(projects.id, blob.projectId),
        });

        if (!project) {
          throw new Error("Project not found");
        }

        if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
          throw new Error("Unauthorized");
        }
      }

      // Delete from Vercel Blob storage first to avoid orphaning storage
      await del(blob.url);

      // Then delete the blob row and reindex remaining orders in the same scope
      await db.transaction(async (tx) => {
        // Remove the blob row first to avoid unique constraint conflicts during compaction
        await tx.delete(blobs).where(eq(blobs.id, blob.id));

        // If this blob participated in ordered images, compact the sequence
        if (blob.order != null) {
          if (blob.projectId) {
            // Safely shift remaining orders down by 1 using a two-phase bump to avoid
            // transient unique conflicts on (project_id, order). See upload-image for context.
            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} + 1000000` })
              .where(
                and(
                  eq(blobs.projectId, blob.projectId),
                  isNotNull(blobs.order),
                  gt(blobs.order, blob.order),
                ),
              );

            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} - 1000001` })
              .where(
                and(
                  eq(blobs.projectId, blob.projectId),
                  gt(blobs.order, 999999),
                ),
              );
          } else if (blob.rowId) {
            // Safely shift remaining orders down by 1 for row scope
            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} + 1000000` })
              .where(
                and(
                  eq(blobs.rowId, blob.rowId),
                  isNotNull(blobs.order),
                  gt(blobs.order, blob.order),
                ),
              );

            await tx
              .update(blobs)
              .set({ order: sql`${blobs.order} - 1000001` })
              .where(and(eq(blobs.rowId, blob.rowId), gt(blobs.order, 999999)));
          }
        }
      });

      return blob.id;
    });
