"server-only";

import { getProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import { getProjectWithPagesSchema } from "@mapform/backend/projects/get-project-with-pages/schema";
import { authAction } from "~/lib/safe-action";

export const getProjectWithPagesAction = authAction
  .schema(getProjectWithPagesSchema)
  .action(async ({ parsedInput }) => getProjectWithPages(parsedInput));
