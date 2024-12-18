"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const upsertLayerAction = async (
  params: Last<Parameters<typeof authClient.upsertLayer>>,
) => {
  const result = await authClient.upsertLayer(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
