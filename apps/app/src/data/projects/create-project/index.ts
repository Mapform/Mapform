"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const createProjectAction = async (
  params: Last<Parameters<typeof authDataService.createProject>>,
) => {
  const result = await authDataService.createProject(params);

  if (result?.data?.id) {
    revalidatePath(`/app/[wsSlug]/${result.data.id}`, "page");
  }

  return result;
};
