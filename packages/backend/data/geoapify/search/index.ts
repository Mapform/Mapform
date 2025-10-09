import { searchSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifyFeatureResponseSchema } from "../lib";

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, limit = 5, center } }) => {
      const response = await geoapifyClient.get("/geocode/autocomplete", {
        params: {
          text: query,
          limit: limit,
          ...(center && { bias: `proximity:${center.lng},${center.lat}` }),
        },
      });
      console.log(1111, response.data?.features[0]);
      return geoapifyFeatureResponseSchema.parse(response.data);
    });

export type Search = UnwrapReturn<typeof search>;
