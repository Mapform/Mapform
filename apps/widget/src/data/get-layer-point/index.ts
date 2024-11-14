"server-only";

import { getLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import { getLayerPointSchema } from "@mapform/backend/datalayer/get-layer-point/schema";
import { action } from "~/lib/safe-action";

/**
 * Returns a single point (a row) from a point layer
 */
export const getLayerPointAction = action
  .schema(getLayerPointSchema)
  .action(async ({ parsedInput }) => getLayerPoint(parsedInput));
