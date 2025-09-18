"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateViewAction = async (
  params: Last<Parameters<typeof authDataService.updateView>>,
) => {
  const result = await authDataService.updateView(params);

  revalidatePath(`/app/[wsSlug]/[pId]`, "page");

  return result;
};
