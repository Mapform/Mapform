"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const duplicateRowsAction = async (
  params: Last<Parameters<typeof authClient.duplicateRows>>,
) => {
  const result = await authClient.duplicateRows(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

  return result;
};
