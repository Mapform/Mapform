"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { catchError } from "@mapform/lib/catch-error";
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

    const [error] = await catchError(updateWorkspace(parsedInput));

    if (error) {
      if ((error as unknown as { code: string }).code === "23505") {
        throw new ServerError("Workspace slug already exists");
      }

      throw error;
    }

    if (workspaceSlug !== parsedInput.slug) {
      redirect(`/app/${parsedInput.slug}/settings`);
    }

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
