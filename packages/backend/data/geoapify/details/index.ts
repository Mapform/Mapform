"server-only";

import { env } from "../../../env.mjs";
import { placeDetailsSchema } from "./schema";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";

interface GeoapifyPlaceDetails {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: {
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
      categories?: string[];
      feature_type?: string;
      // Additional properties that may be present based on feature type
      population?: number;
      population_by_year?: Record<string, number>;
      names?: Record<string, string>;
      geometry_type?: "Point" | "LineString" | "Polygon" | "MultiPolygon";
      range?: number;
      mode?:
        | "drive"
        | "truck"
        | "transit"
        | "approximated_transit"
        | "walk"
        | "bicycle";
      // Building-specific properties
      building_id?: string;
      building_name?: string;
      building_type?: string;
      // Place-specific properties
      website?: string;
      phone?: string;
      email?: string;
      opening_hours?: string;
      rating?: number;
      price_level?: number;
      wheelchair?: string;
      internet_access?: string;
      cuisine?: string;
      brand?: string;
      operator?: string;
      // Rank properties
      rank?: {
        importance: number;
        confidence: number;
        confidence_city_level: number;
        match_type: string;
      };
      // Source and external IDs
      datasource?: {
        raw?: {
          osm?: {
            id?: string;
            type?: string;
            tags?: Record<string, string>;
          };
          wikidata?: string;
        };
      };
    };
    geometry?: {
      type: "Point" | "LineString" | "Polygon" | "MultiPolygon";
      coordinates: number[] | number[][] | number[][][];
    };
    bbox?: [number, number, number, number];
  }[];
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
