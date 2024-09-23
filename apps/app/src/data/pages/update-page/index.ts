"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { pages } from "@mapform/db/schema";
import type { DocumentContent } from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { updatePageSchema } from "./schema";

export const updatePage = authAction
  .schema(updatePageSchema)
  .action(async ({ parsedInput: { id, title, content } }) => {
    const insertContent = content as unknown as { content: DocumentContent };

    const page = await db.query.pages.findFirst({
      where: eq(pages.id, id),
      columns: {
        id: true,
      },
      with: {
        project: {
          columns: {
            id: true,
          },
          with: {
            teamspace: {
              columns: {
                id: true,
              },
              with: {
                workspace: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    await db
      .update(pages)
      .set({ title, content: insertContent })
      .where(eq(pages.id, id));

    revalidatePath(
      `/${page.project.teamspace.workspace.id}/${page.project.teamspace.id}/projects/${page.project.id}`
    );
  });
