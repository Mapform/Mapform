"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateWorkspace } from "@mapform/backend/workspaces/update-workspace";
import { updateWorkspaceSchema } from "@mapform/backend/workspaces/update-workspace/schema";
import { authAction } from "~/lib/safe-action";
import { ServerError } from "~/lib/server-error";

export const updateWorkspaceAction = authAction
  .schema(updateWorkspaceSchema)
  .action(async ({ parsedInput, ctx: { user, workspaceSlug } }) => {
    if (
      user.workspaceMemberships.every((m) => m.workspaceId !== parsedInput.id)
    ) {
      throw new Error("Unauthorized");
    }

    try {
      const [updatedWorkspace] = await updateWorkspace(parsedInput);

      if (updatedWorkspace && workspaceSlug !== updatedWorkspace.slug) {
        redirect(`/app/${updatedWorkspace.slug}/settings`);
      }
    } catch (e: unknown) {
      if ((e as { code: string }).code === "23505") {
        throw new ServerError("Workspace slug already exists");
      }

      throw e;
    }

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
