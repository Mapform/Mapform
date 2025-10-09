import { nearbySchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifyFeatureResponseSchema } from "../lib";

export const nearby = (authClient: PublicClient) =>
  authClient
    .schema(nearbySchema)
    .action(async ({ parsedInput: { categories, center, limit } }) => {
      const response = await geoapifyClient.get("/v1/places/nearby", {
        params: {
          categories: categories.join(","),
          ...(center && { bias: `proximity:${center.lng},${center.lat}` }),
          limit: limit,
        },
      });
      return geoapifyFeatureResponseSchema.parse(response.data);
    });

export type Nearby = UnwrapReturn<typeof nearby>;
