"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { pages, projects } from "@mapform/db/schema";
import type { DocumentContent } from "@mapform/blocknote";
import { authAction } from "~/lib/safe-action";
import { updatePageSchema } from "./schema";

export const updatePage = authAction
  .schema(updatePageSchema)
  .action(
    async ({
      parsedInput: {
        id,
        title,
        content,
        zoom,
        pitch,
        bearing,
        center,
        contentViewType,
      },
    }) => {
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

      await db.transaction(async (tx) => {
        await Promise.all([
          tx
            .update(pages)
            .set({
              zoom,
              title,
              pitch,
              center,
              bearing,
              contentViewType,
              content: insertContent,
            })
            .where(eq(pages.id, id)),

          tx
            .update(projects)
            .set({ isDirty: true })
            .where(eq(projects.id, page.project.id)),
        ]);
      });

      revalidatePath(
        `/${page.project.teamspace.workspace.id}/${page.project.teamspace.id}/projects/${page.project.id}`
      );
    }
  );
