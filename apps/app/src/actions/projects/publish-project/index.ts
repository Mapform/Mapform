"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const publishProjectAction = async (
  params: Parameters<typeof authClient.publishProject>[0],
) => {
  const result = await authClient.publishProject(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  return result;
};
