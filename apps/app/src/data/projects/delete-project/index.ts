"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authDataService } from "~/lib/safe-action";

export const deleteProjectAction = async (
  params: Last<Parameters<typeof authDataService.deleteProject>>,
) => {
  const result = await authDataService.deleteProject(params);
  revalidatePath("/app/[wsSlug]", "page");

  if (params.redirect) {
    redirect(params.redirect);
  }

  return result;
};
