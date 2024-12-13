"server-only";

import { authClient } from "~/lib/safe-action";

/**
 * Returns a single point (a row) from a point layer
 */
export const getLayerPointAction = authClient.getLayerPoint;
