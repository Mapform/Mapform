"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const deleteRowsAction = async (
  params: Last<Parameters<typeof authDataService.deleteRows>>,
) => {
  const result = await authDataService.deleteRows(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
