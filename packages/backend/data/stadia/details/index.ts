"server-only";

import { detailsSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { BASE_URL, locationIqFeatureResponseSchema } from "../helpers";

export const details = (authClient: PublicClient) =>
  authClient
    .schema(detailsSchema)
    .action(async ({ parsedInput: { osmId } }) => {
      const url = new URL(`${BASE_URL}/lookup`);
      url.searchParams.set("key", env.LOCATION_IQ_API_KEY);
      url.searchParams.set("osm_ids", osmId);
      // url.searchParams.set("extratags", "1");
      // url.searchParams.set("addressdetails", "1");
      // url.searchParams.set("polygon_geojson", "1");
      // url.searchParams.set("normalizeaddress", "1");

      console.log("url: ", url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { accept: "application/json" },
      });

      console.log("response: ", response);
      if (!response.ok) {
        throw new Error(`LocationIQ search failed: ${response.status}`);
      }

      const result = locationIqFeatureResponseSchema.parse(
        await response.json(),
      );
      console.log("result: ", result);
      return result.length > 0 ? result[0] : undefined;
    });

export type Details = UnwrapReturn<typeof details>;
