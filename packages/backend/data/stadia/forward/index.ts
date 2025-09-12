"server-only";

import { forwardGeocodeSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { Configuration, GeocodingApi } from "@stadiamaps/api";

export const forwardGeocode = (authClient: PublicClient) =>
  authClient
    .schema(forwardGeocodeSchema)
    .action(async ({ parsedInput: { query, bounds, size = 5 } }) => {
      // No need to pass API key since using domain-based auth
      const config = new Configuration({ apiKey: env.STADIA_API_KEY });
      const api = new GeocodingApi(config);

      return api.searchV2({
        text: query,
        lang: "en",
        boundaryRectMinLon: bounds?.[0],
        boundaryRectMinLat: bounds?.[1],
        boundaryRectMaxLon: bounds?.[2],
        boundaryRectMaxLat: bounds?.[3],
        size,
      });
    });

export type ForwardGeocode = UnwrapReturn<typeof forwardGeocode>;
