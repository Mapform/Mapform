"use server";

import { db } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { pages } from "@mapform/db/schema";
import { authAction } from "~/lib/safe-action";
import { INITIAL_VIEW_STATE } from "~/constants/view-state";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { createPageSchema } from "./schema";

export const createPage = authAction
  .schema(createPageSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    const projectWithPagesResponse = await getProjectWithPages({
      id: projectId,
    });
    const projectWithPages = projectWithPagesResponse?.data;

    if (!projectWithPages) {
      throw new Error("Project not found");
    }

    const nextPagePosition = projectWithPages.pages.length + 1;
    const lastPage = projectWithPages.pages[projectWithPages.pages.length - 1];

    const [page] = await db
      .insert(pages)
      .values({
        projectId,
        position: nextPagePosition,
        zoom: lastPage?.zoom ?? INITIAL_VIEW_STATE.zoom,
        pitch: lastPage?.pitch ?? INITIAL_VIEW_STATE.pitch,
        bearing: lastPage?.bearing ?? INITIAL_VIEW_STATE.bearing,
        center: lastPage?.center ?? {
          x: INITIAL_VIEW_STATE.longitude,
          y: INITIAL_VIEW_STATE.latitude,
        },
      })
      .returning();

    revalidatePath(
      `/${projectWithPages.teamspace.workspace.id}/${projectWithPages.teamspace.id}/projects/${projectId}`
    );

    return page;
  });
