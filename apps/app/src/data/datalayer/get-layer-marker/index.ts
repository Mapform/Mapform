"server-only";

import { getLayerMarker } from "@mapform/backend/datalayer/get-layer-marker";
import { getLayerMarkerSchema } from "@mapform/backend/datalayer/get-layer-marker/schema";
import { shareClient } from "~/lib/safe-action";

/**
 * Returns a single point (a row) from a marker layer
 */
export const getLayermarkerAction = shareClient
  .schema(getLayerMarkerSchema)
  .action(async ({ parsedInput }) => getLayerMarker(parsedInput));
