"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { authDataService } from "~/lib/safe-action";

export const updateWorkspaceAction = async (
  params: Last<Parameters<typeof authDataService.updateWorkspace>>,
) => {
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const result = await authDataService.updateWorkspace(params);

  if (result?.serverError) {
    return result;
  }

  // Redirect to the settings page if the slug has changed
  if (workspaceSlug !== params.slug) {
    redirect(`/app/${params.slug}/settings`);
  }

  revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");

  return result;
};
