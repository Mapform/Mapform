"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const createViewAction = async (
  params: Last<Parameters<typeof authDataService.createView>>,
) => {
  const result = await authDataService.createView(params);

  revalidatePath(`/app/[wsSlug]/${params.projectId}`, "page");

  return result;
};
