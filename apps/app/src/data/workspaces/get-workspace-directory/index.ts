"server-only";

import { getWorkspaceDirectory } from "@mapform/backend/workspaces/get-workspace-directory";
import { getWorkspaceDirectorySchema } from "@mapform/backend/workspaces/get-workspace-directory/schema";
import { authAction } from "~/lib/safe-action";

export const getWorkspaceDirectoryAction = authAction
  .schema(getWorkspaceDirectorySchema)
  .action(({ parsedInput }) => getWorkspaceDirectory(parsedInput));
