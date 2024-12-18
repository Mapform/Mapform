"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createPageLayerAction = async (
  params: Last<Parameters<typeof authClient.createPageLayer>>,
) => {
  const result = await authClient.createPageLayer(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
