import { db } from "@mapform/db";
import { blobs } from "@mapform/db/schema";
import { del } from "@vercel/blob";
import { eq, lt, isNotNull } from "@mapform/db/utils";
import { NextResponse } from "next/server";

// Vercel cron jobs can only run at most once per hour
// https://vercel.com/docs/cron-jobs#cron-expressions
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max duration

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
        isNotNull(blob.queuedForDeletionDate) &&
        lt(blob.queuedForDeletionDate, oneHourAgo),
    });

    if (blobsToDelete.length === 0) {
      return NextResponse.json({ message: "No blobs to delete" });
    }

    // Delete each blob from Vercel storage and the database
    const results = await Promise.allSettled(
      blobsToDelete.map(async (blob) => {
        try {
          // Delete from Vercel Blob storage
          await del(blob.url);

          // Delete from database
          await db.delete(blobs).where(eq(blobs.id, blob.id));

          return { success: true, url: blob.url };
        } catch (error) {
          console.error(`Failed to delete blob ${blob.url}:`, error);
          return { success: false, url: blob.url, error };
        }
      }),
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;
    const failed = results.filter(
      (r) =>
        r.status === "rejected" ||
        (r.status === "fulfilled" && !r.value.success),
    ).length;

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
