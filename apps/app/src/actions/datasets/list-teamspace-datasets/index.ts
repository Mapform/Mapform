"server-only";

import { listTeamspaceDatasets } from "@mapform/backend/datasets/list-teamspace-datasets";
import { listTeamspaceDatasetsSchema } from "@mapform/backend/datasets/list-teamspace-datasets/schema";
import { authAction } from "~/lib/safe-action";

export const listTeamspaceDatasetsAction = authAction
  .schema(listTeamspaceDatasetsSchema)
  .action(async ({ parsedInput }) => listTeamspaceDatasets(parsedInput));
