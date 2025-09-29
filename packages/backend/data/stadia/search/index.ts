"server-only";

import { searchSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { Configuration, GeocodingApi } from "@stadiamaps/api";

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, bounds, center } }) => {
      // No need to pass API key since using domain-based auth
      const config = new Configuration({ apiKey: env.STADIA_API_KEY });
      const api = new GeocodingApi(config);

      return api.autocompleteV2({
        text: query,
        lang: "en",
        focusPointLon: center?.lng,
        focusPointLat: center?.lat,
        boundaryRectMinLon: bounds?.[0],
        boundaryRectMinLat: bounds?.[1],
        boundaryRectMaxLon: bounds?.[2],
        boundaryRectMaxLat: bounds?.[3],
      });
    });

export type Search = UnwrapReturn<typeof search>;
