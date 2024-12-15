"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateProjectAction = async (
  params: Parameters<typeof authClient.updateProject>[0],
) => {
  const result = await authClient.updateProject(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
