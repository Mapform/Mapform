"server-only";

import { forwardGeocodeSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { BASE_URL, locationIqFeatureResponseSchema } from "../helpers";

export const forwardGeocode = (authClient: PublicClient) =>
  authClient
    .schema(forwardGeocodeSchema)
    .action(async ({ parsedInput: { query, bounds, size = 5 } }) => {
      const url = new URL(`${BASE_URL}/search`);
      url.searchParams.set("key", env.LOCATION_IQ_API_KEY);
      url.searchParams.set("q", query);
      url.searchParams.set("limit", String(size));
      url.searchParams.set("format", "json");
      url.searchParams.set("extratags", "1");

      if (bounds && bounds.length === 4) {
        const [minLon, minLat, maxLon, maxLat] = bounds;
        // viewbox format: left,top,right,bottom
        url.searchParams.set(
          "viewbox",
          `${minLon},${maxLat},${maxLon},${minLat}`,
        );
        url.searchParams.set("bounded", "1");
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`LocationIQ search failed: ${response.status}`);
      }

      return locationIqFeatureResponseSchema.parse(await response.json());
    });

export type ForwardGeocode = UnwrapReturn<typeof forwardGeocode>;
