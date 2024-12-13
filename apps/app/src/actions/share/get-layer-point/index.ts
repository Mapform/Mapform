"server-only";

import { getLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import { getLayerPointSchema } from "@mapform/backend/datalayer/get-layer-point/schema";
import { shareClient } from "~/lib/safe-action";

export const dynamic = "force-dynamic";

/**
 * Returns a single point (a row) from a point layer
 */
export const getLayerPointAction = shareClient
  .schema(getLayerPointSchema)
  .action(async ({ parsedInput }) => getLayerPoint(parsedInput));
