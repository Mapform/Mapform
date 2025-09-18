"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const duplicateRowsAction = async (
  params: Last<Parameters<typeof authDataService.duplicateRows>>,
) => {
  const result = await authDataService.duplicateRows(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
