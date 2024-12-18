"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateLayerOrderAction = async (
  params: Last<Parameters<typeof authClient.updateLayerOrder>>,
) => {
  const result = await authClient.updateLayerOrder(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
