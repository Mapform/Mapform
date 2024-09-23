"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { createPageSchema } from "./schema";

export const createPage = authAction
  .schema(createPageSchema)
  .action(
    async ({ parsedInput: { projectId, center, zoom, pitch, bearing } }) => {
      const projectWithPagesResponse = await getProjectWithPages({
        id: projectId,
      });
      const projectWithPages = projectWithPagesResponse?.data;

      if (!projectWithPages) {
        throw new Error("Project not found");
      }

      const nextPagePosition = projectWithPages.pages.length + 1;

      const [page] = await db
        .insert(pages)
        .values({
          projectId,
          position: nextPagePosition,
          zoom,
          pitch,
          bearing,
          center,
        })
        .returning();

      revalidatePath(
        `/${projectWithPages.teamspace.workspace.id}/${projectWithPages.teamspace.id}/projects/${projectId}`
      );

      return page;
    }
  );
