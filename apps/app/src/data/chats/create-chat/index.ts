"use server";

import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const createChatAction = async (
  params: Last<Parameters<typeof authDataService.createChat>>,
) => {
  console.log("creating chat", params);
  const result = await authDataService.createChat(params);

  console.log("chat created?", result);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
