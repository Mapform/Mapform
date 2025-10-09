import { detailsSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifyFeatureResponseSchema } from "../lib";

export const details = (authClient: PublicClient) =>
  authClient.schema(detailsSchema).action(async ({ parsedInput: { id } }) => {
    const response = await geoapifyClient.get("/v2/place-details", {
      params: {
        id: id,
      },
    });

    return geoapifyFeatureResponseSchema.parse(response.data);
  });

export type Details = UnwrapReturn<typeof details>;
