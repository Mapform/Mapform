"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const editColumnAction = async (
  params: Last<Parameters<typeof authClient.updateColumn>>,
) => {
  const result = await authClient.updateColumn(params);

  revalidatePath("/app/[wsSlug]/[pId]", "page");

  return result;
};
