"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteLayerAction = async (
  params: Parameters<typeof authClient.deleteLayer>[0],
) => {
  const result = await authClient.deleteLayer(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
