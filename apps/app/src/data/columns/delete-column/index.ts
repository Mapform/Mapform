"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const deleteColumnAction = async (
  params: Last<Parameters<typeof authDataService.deleteColumn>>,
) => {
  const result = await authDataService.deleteColumn(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
