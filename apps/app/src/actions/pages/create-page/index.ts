"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createPageAction = async (
  params: Parameters<typeof authClient.createPage>[0],
) => {
  const result = await authClient.createPage(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
