"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

export const createProjectAction = async (
  params: Last<Parameters<typeof authClient.createProject>>,
) => {
  const result = await authClient.createProject(params);

  if (result?.data?.id) {
    revalidatePath(`/app/[wsSlug]/${result.data.id}`, "page");
  }

  return result;
};
