"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateProjectOrderAction = async (
  params: Last<Parameters<typeof authDataService.updateProjectOrder>>,
) => {
  const result = await authDataService.updateProjectOrder(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
