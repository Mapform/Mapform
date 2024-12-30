"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const createProjectAction = async (
  params: Last<Parameters<typeof authClient.createProject>>,
) => {
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";
  const result = await authClient.createProject(params);

  if (!result?.serverError && !result?.validationErrors) {
    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
    redirect(
      `/app/${workspaceSlug}/${teamspaceSlug}/projects/${result?.data?.id}`,
    );
  }

  return result;
};
