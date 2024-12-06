"server-only";

import { getRecentProjects } from "@mapform/backend/projects/get-recent-projects";
import { getRecentProjectsSchema } from "@mapform/backend/projects/get-recent-projects/schema";
import { authAction } from "~/lib/safe-action";

export const getRecentProjectsAction = authAction
  .schema(getRecentProjectsSchema)
  .action(async ({ parsedInput }) => getRecentProjects(parsedInput));
