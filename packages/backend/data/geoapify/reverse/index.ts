import { reverseGeocodeSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifyFeatureResponseSchema } from "../lib";

export const reverseGeocode = (authClient: PublicClient) =>
  authClient
    .schema(reverseGeocodeSchema)
    .action(async ({ parsedInput: { lat, lng } }) => {
      const response = await geoapifyClient.get("/v1/geocode/reverse", {
        params: {
          lat: lat,
          lng: lng,
        },
      });
      return geoapifyFeatureResponseSchema.parse(response.data);
    });

export type ReverseGeocode = UnwrapReturn<typeof reverseGeocode>;
