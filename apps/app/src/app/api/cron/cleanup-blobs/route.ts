import { db, sql } from "@mapform/db";
import { blobs } from "@mapform/db/schema";
import { del } from "@vercel/blob";
import { and, eq, gt, lt, isNotNull } from "@mapform/db/utils";
import { NextResponse } from "next/server";

// Vercel cron jobs can only run at most once per hour
// https://vercel.com/docs/cron-jobs#cron-expressions
export const dynamic = "force-dynamic";
// Hobby plan serverless functions must have maxDuration between 1 and 60 seconds.
export const maxDuration = 60;

export async function GET(req: Request) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all blobs that were queued for deletion more than 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const blobsToDelete = await db.query.blobs.findMany({
      where: (blob) =>
        and(
          isNotNull(blob.queuedForDeletionDate),
          lt(blob.queuedForDeletionDate, oneHourAgo),
        ),
    });

    if (blobsToDelete.length === 0) {
      return NextResponse.json({ message: "No blobs to delete" });
    }

    // Process sequentially to avoid unique order conflicts when compacting
    let successful = 0;
    let failed = 0;
    for (const blob of blobsToDelete) {
      try {
        // Delete from Vercel Blob storage
        await del(blob.url);

        // Delete row then compact orders in the same scope
        await db.transaction(async (tx) => {
          await tx.delete(blobs).where(eq(blobs.id, blob.id));

          if (blob.order != null) {
            if (blob.projectId) {
              await tx
                .update(blobs)
                .set({ order: sql`${blobs.order} - 1` })
                .where(
                  and(
                    eq(blobs.projectId, blob.projectId),
                    isNotNull(blobs.order),
                    gt(blobs.order, blob.order),
                  ),
                );
            } else if (blob.rowId) {
              await tx
                .update(blobs)
                .set({ order: sql`${blobs.order} - 1` })
                .where(
                  and(
                    eq(blobs.rowId, blob.rowId),
                    isNotNull(blobs.order),
                    gt(blobs.order, blob.order),
                  ),
                );
            }
          }
        });

        successful += 1;
      } catch (error) {
        console.error(`Failed to delete blob ${blob.url}:`, error);
        failed += 1;
      }
    }

    return NextResponse.json({
      message: `Processed ${blobsToDelete.length} blobs`,
      successful,
      failed,
    });
  } catch (error) {
    console.error("Error in cleanup-blobs cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
