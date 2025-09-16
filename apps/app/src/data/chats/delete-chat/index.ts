"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const deleteChatAction = async (
  params: Last<Parameters<typeof authDataService.deleteChat>>,
) => {
  const result = await authDataService.deleteChat(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
