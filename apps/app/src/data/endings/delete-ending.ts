"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const deleteEndingAction = async (
  params: Last<Parameters<typeof authClient.deleteEnding>>,
) => {
  const result = await authClient.deleteEnding(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
