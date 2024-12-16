"server-only";

import { db } from "@mapform/db";
import { pages } from "@mapform/db/schema";
import { count, eq } from "@mapform/db/utils";
import { deletePageSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";

export const deletePage = (authClient: UserAuthClient) =>
  authClient
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
    });
