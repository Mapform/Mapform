"server-only";

import { env } from "../../../env.mjs";
import { placeDetailsSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";

interface GeoapifyPlaceDetails {
  name: string;
}

export const getPlaceDetails = (authClient: PublicClient) =>
  authClient
    .schema(placeDetailsSchema)
    .action(async ({ parsedInput: { placeId } }) => {
      try {
        const searchParams = new URLSearchParams({
          apiKey: env.GEOAPIFY_API_KEY,
          id: placeId,
        }).toString();

        const response = await fetch(
          `https://api.geoapify.com/v2/place-details?${searchParams}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data: GeoapifyPlaceDetails = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });

export type GetPlaceDetails = UnwrapReturn<typeof getPlaceDetails>;
