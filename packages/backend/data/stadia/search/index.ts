"server-only";

import { searchSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { Configuration, GeocodingApi } from "@stadiamaps/api";

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, bounds } }) => {
      // No need to pass API key since using domain-based auth
      const config = new Configuration({ apiKey: env.STADIA_API_KEY });
      const api = new GeocodingApi(config);

      console.log(1111, env.STADIA_API_KEY);

      const result = await api
        .autocompleteV2({
          text: query,
          lang: "en",
          boundaryRectMinLon: bounds?.[0],
          boundaryRectMinLat: bounds?.[1],
          boundaryRectMaxLon: bounds?.[2],
          boundaryRectMaxLat: bounds?.[3],
        })
        .catch((error) => {
          console.error(error);
          throw new Error("Failed to search");
        });

      console.log(result);

      return result;
    });

export type Search = UnwrapReturn<typeof search>;
