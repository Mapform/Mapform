"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const publishProjectAction = async (
  params: Last<Parameters<typeof authClient.publishProject>>,
) => {
  const result = await authClient.publishProject(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
