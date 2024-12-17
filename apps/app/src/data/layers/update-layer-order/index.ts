"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateLayerOrderAction = async (
  params: Parameters<typeof authClient.updateLayerOrder>[0],
) => {
  const result = await authClient.updateLayerOrder(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
