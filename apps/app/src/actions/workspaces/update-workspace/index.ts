"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";

// TODO: Not finished implementing
export const updateWorkspaceAction = async (
  params: Parameters<typeof authClient.createProject>[0],
) => {
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const result = await authClient.updateWorkspace(params);

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

// const [error] = await catchError(updateWorkspace(parsedInput));

// if (error) {
//   if ((error as unknown as { code: string }).code === "23505") {
//     throw new ServerError("Workspace slug already exists");
//   }

//   throw error;
// }
