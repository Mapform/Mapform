"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteColumnAction = async (
  params: Last<Parameters<typeof authClient.deleteColumn>>,
) => {
  const result = await authClient.deleteColumn(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
