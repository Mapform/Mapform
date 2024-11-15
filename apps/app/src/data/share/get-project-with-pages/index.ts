"server-only";

import { getProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import { getProjectWithPagesSchema } from "@mapform/backend/projects/get-project-with-pages/schema";
import { shareClient } from "~/lib/safe-action";

export const getProjectWithPagesAction = shareClient
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput }) => getProjectWithPages(parsedInput));
