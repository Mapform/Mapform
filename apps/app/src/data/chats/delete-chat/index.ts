"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteChatAction = async (
  params: Last<Parameters<typeof authClient.deleteChat>>,
) => {
  const result = await authClient.deleteChat(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
