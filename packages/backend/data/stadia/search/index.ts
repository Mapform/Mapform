"server-only";

import { searchSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { BASE_URL, locationIqFeatureResponseSchema } from "../helpers";

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, bounds } }) => {
      // Build LocationIQ Autocomplete request
      const url = new URL(`${BASE_URL}/autocomplete`);
      url.searchParams.set("key", env.LOCATION_IQ_API_KEY);
      url.searchParams.set("q", query);
      url.searchParams.set("limit", "10");
      // Bound results to current map bounds if provided
      if (bounds) {
        const [minLon, minLat, maxLon, maxLat] = bounds;
        // viewbox format: left,top,right,bottom
        url.searchParams.set(
          "viewbox",
          `${minLon},${maxLat},${maxLon},${minLat}`,
        );
        url.searchParams.set("bounded", "1");
      }
      // Optionally bias by center via proximity-like behavior: not directly supported by LocationIQ,
      // leaving for future if needed.

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`LocationIQ autocomplete failed: ${response.status}`);
      }

      const result = (await response.json()) as unknown;

      console.log("result: ", result);

      return locationIqFeatureResponseSchema.parse(result);
    });

export type Search = UnwrapReturn<typeof search>;
