"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteRowsAction = async (
  params: Last<Parameters<typeof authClient.deleteRows>>,
) => {
  const result = await authClient.deleteRows(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
