import { db } from "@mapform/db";
import { pages } from "@mapform/db/schema";
import { getProjectWithPages } from "../../projects/get-project-with-pages";
import type { CreatePageSchema } from "./schema";

export const createPage = async ({
  projectId,
  center,
  zoom,
  pitch,
  bearing,
}: CreatePageSchema) => {
  const projectWithPagesResponse = await getProjectWithPages({
    id: projectId,
  });

  if (!projectWithPagesResponse) {
    throw new Error("Project not found");
  }

  const nextPagePosition = projectWithPagesResponse.pages.length + 1;

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

  return page;
};
