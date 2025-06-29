"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateRowAction = async (
  params: Last<Parameters<typeof authClient.updateRow>>,
) => {
  const result = await authClient.updateRow(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
