"server-only";

import { env } from "../../../env.mjs";
import { autocompleteSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";

export interface GeoapifyAutocompleteResult {
  type: string;
  features: {
    type?: string;
    properties?: {
      place_id: string;
      name?: string;
      country: string;
      country_code: string;
      region: string;
      state: string;
      city: string;
      lon: number;
      lat: number;
      result_type:
        | "unknown"
        | "amenity"
        | "building"
        | "street"
        | "suburb"
        | "district"
        | "postcode"
        | "city"
        | "county"
        | "state"
        | "country";
      formatted: string;
      address_line1: string;
      address_line2: string;
      category: string;
      rank: {
        importance: number;
        confidence: number;
        confidence_city_level: number;
        match_type: string;
      };
      geometry?: {
        type: "Point" | unknown;
        coordinates: [number, number] | unknown;
      };
    };
    bbox?: [number, number, number, number];
  }[];
}

export const autocomplete = (authClient: PublicClient) =>
  authClient
    .schema(autocompleteSchema)
    .action(async ({ parsedInput: { query, bounds } }) => {
      try {
        const searchParams = new URLSearchParams({
          apiKey: env.GEOAPIFY_API_KEY,
          text: query,
          ...(bounds ? { bias: `rect:${bounds.join(",")}` } : {}),
        }).toString();

        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${searchParams}`,
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

        const data: GeoapifyAutocompleteResult = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          `Failed to autocomplete places: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });

export type Autocomplete = UnwrapReturn<typeof autocomplete>;
