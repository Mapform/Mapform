"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { revalidatePath } from "next/cache";
import { pages, projects } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { updatePageOrderSchema } from "./schema";

export const updatePageOrder = authAction
  .schema(updatePageOrderSchema)
  .action(async ({ parsedInput: { projectId, pageOrder } }) => {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
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
        pages: {
          columns: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    await db.transaction(async (tx) =>
      Promise.all(
        pageOrder.map((pageId, index) =>
          tx
            .update(pages)
            .set({
              position: index + 1,
            })
            .where(eq(pages.id, pageId))
        )
      )
    );

    revalidatePath(
      `/${project.teamspace.workspace.id}/${project.teamspace.id}/projects/${projectId}`
    );
  });
