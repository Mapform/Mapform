"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateViewAction = async (
  params: Last<Parameters<typeof authClient.updateView>>,
) => {
  const result = await authClient.updateView(params);

  revalidatePath(`/app/[wsSlug]/[pId]`, "page");

  return result;
};
