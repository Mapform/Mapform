"server-only";

import { reverseGeocodeSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { Configuration, GeocodingApi } from "@stadiamaps/api";

export const reverseGeocode = (authClient: PublicClient) =>
  authClient
    .schema(reverseGeocodeSchema)
    .action(async ({ parsedInput: { lat, lng } }) => {
      // No need to pass API key since using domain-based auth
      const config = new Configuration({ apiKey: env.STADIA_API_KEY });
      const api = new GeocodingApi(config);

      return api.reverseV2({
        pointLat: lat,
        pointLon: lng,
        lang: "en",
      });
    });

export type ReverseGeocode = UnwrapReturn<typeof reverseGeocode>;
