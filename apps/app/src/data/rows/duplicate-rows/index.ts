"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const duplicateRowsAction = async (
  params: Parameters<typeof authClient.duplicateRows>[0],
) => {
  const result = await authClient.duplicateRows(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

  return result;
};
