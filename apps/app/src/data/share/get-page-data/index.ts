"server-only";

import { getPageData } from "@mapform/backend/datalayer/get-page-data";
import { getPageDataSchema } from "@mapform/backend/datalayer/get-page-data/schema";
import { shareClient } from "~/lib/safe-action";

export const getPageDataAction = shareClient
  .schema(getPageDataSchema)
  .action(async ({ parsedInput }) => getPageData(parsedInput));
