"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deletePageLayerAction = async (
  params: Parameters<typeof authClient.deletePageLayer>[0],
) => {
  const result = await authClient.deletePageLayer(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
