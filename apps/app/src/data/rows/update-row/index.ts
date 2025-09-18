"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateRowAction = async (
  params: Last<Parameters<typeof authDataService.updateRow>>,
) => {
  const result = await authDataService.updateRow(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
