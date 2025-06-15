import { cache } from "react";
import { authClient } from "~/lib/safe-action";

export const getWorkspaceDirectory = cache(authClient.getWorkspaceDirectory);
