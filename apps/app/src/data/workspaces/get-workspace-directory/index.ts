import { cache } from "react";
import { authDataService } from "~/lib/safe-action";

export const getWorkspaceDirectory = cache(
  authDataService.getWorkspaceDirectory,
);
