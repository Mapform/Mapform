"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const deleteDatasetAction = async (
  params: Last<Parameters<typeof authClient.deleteDataset>>,
) => {
  const result = await authClient.deleteDataset(params);
  revalidatePath("/app/[wsSlug]", "page");

  if (params.redirect) {
    redirect(params.redirect);
  }

  return result;
};
