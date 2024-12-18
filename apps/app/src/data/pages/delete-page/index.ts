"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const deletePageAction = async (
  params: Last<Parameters<typeof authClient.deletePage>>,
) => {
  const result = await authClient.deletePage(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
