"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createEmptyDatasetAction = authClient.createEmptyDataset;

export const deleteDatasetAction = async (
  params: Parameters<typeof authClient.deleteDataset>[0],
) => {
  const result = await authClient.deleteDataset(params);
  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
