"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { deletePageSchema } from "./schema";
import { count, eq } from "@mapform/db/utils";

export const deletePage = authAction
  .schema(deletePageSchema)
  .action(async ({ parsedInput: { pageId, projectId } }) => {
    const [pageCount] = await db
      .select({ count: count() })
      .from(pages)
      .where(eq(pages.projectId, projectId));

    if (!pageCount) {
      throw new Error("Page not found");
    }

    if (pageCount?.count <= 1) {
      throw new Error("Cannot delete the last page");
    }

    await db.delete(pages).where(eq(pages.id, pageId));

    revalidatePath("/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
