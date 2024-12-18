"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteLayerAction = async (
  params: Last<Parameters<typeof authClient.deleteLayer>>,
) => {
  const result = await authClient.deleteLayer(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
