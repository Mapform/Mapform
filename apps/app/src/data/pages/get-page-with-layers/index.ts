"server-only";

import { getPageWithLayers } from "@mapform/backend/pages/get-page-with-layers";
import { getPageWithLayersSchema } from "@mapform/backend/pages/get-page-with-layers/schema";
import { authAction } from "~/lib/safe-action";

export const getPageWithLayersAction = authAction
  .schema(getPageWithLayersSchema)
  .action(async ({ parsedInput }) => getPageWithLayers(parsedInput));
