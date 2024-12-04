"use server";

import { revalidatePath } from "next/cache";
import { updateWorkspace } from "@mapform/backend/workspaces/update-workspace";
import { updateWorkspaceSchema } from "@mapform/backend/workspaces/update-workspace/schema";
import { authAction } from "~/lib/safe-action";

export const updateWorkspaceAction = authAction
  .schema(updateWorkspaceSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (
      user.workspaceMemberships.every((m) => m.workspaceId !== parsedInput.id)
    ) {
      throw new Error("Unauthorized");
    }

    await updateWorkspace(parsedInput);

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
