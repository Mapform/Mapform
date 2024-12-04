"server-only";

import { updateWorkspace } from "@mapform/backend/workspaces/update-workspace";
import { updateWorkspaceSchema } from "@mapform/backend/workspaces/update-workspace/schema";
import { authAction } from "~/lib/safe-action";

export const updateWorkspaceAction = authAction
  .schema(updateWorkspaceSchema)
  .action(({ parsedInput, ctx: { user } }) => {
    if (
      user.workspaceMemberships.every((m) => m.workspaceId !== parsedInput.id)
    ) {
      throw new Error("Unauthorized");
    }

    return updateWorkspace(parsedInput);
  });
