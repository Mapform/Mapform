"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createEndingAction = async (
  params: Last<Parameters<typeof authClient.createEnding>>,
) => {
  const result = await authClient.createEnding(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
