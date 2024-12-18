"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updatePageOrderAction = async (
  params: Last<Parameters<typeof authClient.updatePageOrder>>,
) => {
  const result = await authClient.updatePageOrder(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
