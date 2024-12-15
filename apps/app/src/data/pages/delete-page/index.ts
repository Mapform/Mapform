"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deletePageAction = async (
  params: Parameters<typeof authClient.deletePage>[0],
) => {
  const result = await authClient.deletePage(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
