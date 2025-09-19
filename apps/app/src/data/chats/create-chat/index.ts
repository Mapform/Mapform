"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const createChatAction = async (
  params: Last<Parameters<typeof authDataService.createChat>>,
) => {
  const result = await authDataService.createChat(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
