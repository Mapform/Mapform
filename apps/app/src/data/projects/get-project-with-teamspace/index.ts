"server-only";

import { getProjectWithTeamspace } from "@mapform/backend/projects/get-project-with-teamspace";
import { getProjectWithTeamspaceSchema } from "@mapform/backend/projects/get-project-with-teamspace/schema";
import { authAction } from "~/lib/safe-action";

export const getProjectWithTeamspaceAction = authAction
  .schema(getProjectWithTeamspaceSchema)
  .action(async ({ parsedInput }) => getProjectWithTeamspace(parsedInput));
