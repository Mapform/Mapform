"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const deleteViewAction = async (
  params: Last<Parameters<typeof authDataService.deleteView>>,
) => {
  const result = await authDataService.deleteView(params);

  revalidatePath(`/app/[wsSlug]/[pId]`, "page");

  return result;
};
