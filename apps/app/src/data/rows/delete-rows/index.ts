"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteRowsAction = async (
  params: Parameters<typeof authClient.deleteRows>[0],
) => {
  const result = await authClient.deleteRows(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");

  return result;
};
