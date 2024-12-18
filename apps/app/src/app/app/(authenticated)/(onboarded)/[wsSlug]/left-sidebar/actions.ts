"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createEmptyDatasetAction = authClient.createEmptyDataset;

export const deleteDatasetAction = async (
  params: Last<Parameters<typeof authClient.deleteDataset>>,
) => {
  const result = await authClient.deleteDataset(params);
  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
