"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteColumnAction = async (
  params: Last<Parameters<typeof authClient.deleteColumn>>,
) => {
  const result = await authClient.deleteColumn(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets/[dId]", "page");
  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
