"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateColumnAction = async (
  params: Last<Parameters<typeof authDataService.updateColumn>>,
) => {
  const result = await authDataService.updateColumn(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
