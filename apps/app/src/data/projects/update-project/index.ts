"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const updateProjectAction = async (
  params: Last<Parameters<typeof authClient.updateProject>>,
) => {
  const result = await authClient.updateProject(params);

  revalidatePath("/app/[wsSlug]", "page");

  return result;
};
