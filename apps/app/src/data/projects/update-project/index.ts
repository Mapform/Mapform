"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateProjectAction = async (
  params: Last<Parameters<typeof authDataService.updateProject>>,
) => {
  const result = await authDataService.updateProject(params);

  revalidatePath(`/app/[wsSlug]`, "page");

  return result;
};
