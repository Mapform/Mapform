"use server";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { pages, projects } from "@mapform/db/schema";
import type { UpdatePageOrderSchema } from "./schema";

export const updatePageOrder = async ({
  projectId,
  pageOrder,
}: UpdatePageOrderSchema) => {
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
          .where(eq(pages.id, pageId)),
      ),
    ),
  );

  return project;
};
