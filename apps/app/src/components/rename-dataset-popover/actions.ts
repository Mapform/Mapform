"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateDatasetAction = async (
  params: Last<Parameters<typeof authClient.updateDataset>>,
) => {
  const result = await authClient.updateDataset(params);
  revalidatePath("/app/[wsSlug]/[tsSlug]", "page");

  return result;
};
