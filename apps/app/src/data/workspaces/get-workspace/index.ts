"server-only";

import { getWorkspace } from "@mapform/backend/workspaces/get-workspace";
import { getWorkspaceSchema } from "@mapform/backend/workspaces/get-workspace/schema";
import { authAction } from "~/lib/safe-action";

export const getWorkspaceAction = authAction
  .schema(getWorkspaceSchema)
  .action(({ parsedInput }) => getWorkspace(parsedInput));
