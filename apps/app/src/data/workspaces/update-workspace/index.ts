"use server";

import { revalidatePath } from "next/cache";
import { updateWorkspace } from "@mapform/backend/workspaces/update-workspace";
import { updateWorkspaceSchema } from "@mapform/backend/workspaces/update-workspace/schema";
import { authAction } from "~/lib/safe-action";
import { ServerError } from "~/lib/server-error";

export const updateWorkspaceAction = authAction
  .schema(updateWorkspaceSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (
      user.workspaceMemberships.every((m) => m.workspaceId !== parsedInput.id)
    ) {
      throw new Error("Unauthorized");
    }

    try {
      await updateWorkspace(parsedInput);
    } catch (e: unknown) {
      if ((e as { code: string }).code === "23505") {
        throw new ServerError("Workspace slug already exists");
      }

      throw e;
    }

    revalidatePath(`/app/[wsSlug]/[tsSlug]`, "page");
  });
