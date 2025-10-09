import { forwardGeocodeSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifyForwardResponseSchema } from "../lib";

export const forwardGeocode = (authClient: PublicClient) =>
  authClient
    .schema(forwardGeocodeSchema)
    .action(async ({ parsedInput: { query, limit = 5, center } }) => {
      const response = await geoapifyClient.get("/v1/geocode/search", {
        params: {
          text: query,
          limit: limit,
          ...(center && { bias: `proximity:${center.lng},${center.lat}` }),
        },
      });
      return geoapifyForwardResponseSchema.parse(response.data);
    });

export type ForwardGeocode = UnwrapReturn<typeof forwardGeocode>;
