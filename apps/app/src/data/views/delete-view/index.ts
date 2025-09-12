"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteViewAction = async (
  params: Last<Parameters<typeof authClient.deleteView>>,
) => {
  const result = await authClient.deleteView(params);

  revalidatePath(`/app/[wsSlug]/[pId]`, "page");

  return result;
};
