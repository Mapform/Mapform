"server-only";

import { getPageData } from "@mapform/backend/datalayer/get-page-data";
import { getPageDataSchema } from "@mapform/backend/datalayer/get-page-data/schema";
import { action } from "~/lib/safe-action";

export const getPageDataAction = action
  .schema(getPageDataSchema)
  .action(async ({ parsedInput }) => getPageData(parsedInput));
