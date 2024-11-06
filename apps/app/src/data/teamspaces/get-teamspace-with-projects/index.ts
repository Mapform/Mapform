"server-only";

import { getTeamspaceWithProjects } from "@mapform/backend/teamspaces/get-teamspace-with-projects";
import { getTeamspaceWithProjectsSchema } from "@mapform/backend/teamspaces/get-teamspace-with-projects/schema";
import { authAction } from "~/lib/safe-action";

export const getTeamspaceWithProjectsAction = authAction
  .schema(getTeamspaceWithProjectsSchema)
  .action(async ({ parsedInput }) => getTeamspaceWithProjects(parsedInput));
