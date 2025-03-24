"server-only";

import { db } from "@mapform/db";
import { pages, projects } from "@mapform/db/schema";
import { and, eq, gt, sql } from "@mapform/db/utils";
import { deletePageSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";

export const deletePage = (authClient: UserAuthClient) =>
  authClient
    .schema(deletePageSchema)
    .action(async ({ parsedInput: { pageId, projectId } }) => {
      const [projectPages, project] = await Promise.all([
        db.query.pages.findMany({
          where: eq(pages.projectId, projectId),
        }),

        db.query.projects.findFirst({
          where: eq(projects.id, projectId),
        }),
      ]);

      const pageCount = projectPages.length;

      if (!project) {
        throw new Error("Project not found");
      }

      if (pageCount <= 1) {
        throw new ServerError("Cannot delete the last page");
      }

      if (
        project.formsEnabled &&
        !projectPages
          .filter((page) => page.id !== pageId)
          .some((page) => page.pageType === "page_ending")
      ) {
        throw new ServerError("Project must have at least one End Screen.");
      }

      await db.transaction(async (tx) => {
        const deletedPage = await tx.query.pages.findFirst({
          where: eq(pages.id, pageId),
        });

        if (!deletedPage) {
          throw new Error("Page not found");
        }

        await tx.delete(pages).where(eq(pages.id, pageId));

        await tx
          .update(pages)
          .set({
            position: sql`${pages.position} - 1`,
          })
          .where(
            and(
              eq(pages.projectId, projectId),
              gt(pages.position, deletedPage.position),
            ),
          );
      });
    });
