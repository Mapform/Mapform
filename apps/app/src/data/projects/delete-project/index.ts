"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const deleteProjectAction = async (
  params: Last<Parameters<typeof authClient.deleteProject>>,
) => {
  const result = await authClient.deleteProject(params);
  revalidatePath("/app/[wsSlug]", "page");

  if (params.redirect) {
    redirect(params.redirect);
  }

  return result;
};
