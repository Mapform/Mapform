import { searchSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
import { geoapifyClient, geoapifySearchResponseSchema } from "../lib";

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, limit = 5, center } }) => {
      const response = await geoapifyClient.get("/v1/geocode/autocomplete", {
        params: {
          text: query,
          limit: limit,
          ...(center && { bias: `proximity:${center.lng},${center.lat}` }),
        },
      });

      return geoapifySearchResponseSchema.parse(response.data);
    });

export type Search = UnwrapReturn<typeof search>;
