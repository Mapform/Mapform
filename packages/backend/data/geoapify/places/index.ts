"server-only";

import { env } from "../../../env.mjs";
import { placesSchema } from "./schema";
import { PlaceCondition, PlaceCategory } from "./enums";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";

interface GeoapifyPlace {
  type: "Feature";
  properties: {
    place_id: string;
    name?: string;
    name_international?: {
      en: string;
    };
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
      sourcename?: string;
    };
  };
  geometry?: {
    type: "Point" | "LineString" | "Polygon" | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][];
  };
  bbox?: [number, number, number, number];
}

export interface GeoapifyPlacesResponse {
  type: "FeatureCollection";
  features: GeoapifyPlace[];
}

export const searchPlaces = (authClient: PublicClient) =>
  authClient.schema(placesSchema).action(async ({ parsedInput }) => {
    console.log(11111, parsedInput);
    try {
      const searchParams = new URLSearchParams({
        apiKey: env.GEOAPIFY_API_KEY,
      });

      // Add categories if provided
      if (parsedInput.categories && parsedInput.categories.length > 0) {
        searchParams.append("categories", parsedInput.categories.join(","));
      }

      // Add conditions if provided
      if (parsedInput.conditions && parsedInput.conditions.length > 0) {
        searchParams.append("conditions", parsedInput.conditions.join(","));
      }

      // Add filter if provided
      if (parsedInput.filter) {
        let filterValue: string;
        switch (parsedInput.filter.type) {
          case "circle":
            filterValue = `circle:${parsedInput.filter.lon},${parsedInput.filter.lat},${parsedInput.filter.radiusMeters}`;
            break;
          case "rect":
            filterValue = `rect:${parsedInput.filter.lon1},${parsedInput.filter.lat1},${parsedInput.filter.lon2},${parsedInput.filter.lat2}`;
            break;
          case "geometry":
            filterValue = `geometry:${parsedInput.filter.geometryId}`;
            break;
          case "place":
            filterValue = `place:${parsedInput.filter.placeId}`;
            break;
        }
        searchParams.append("filter", filterValue);
      }

      // Add bias if provided
      if (parsedInput.bias) {
        searchParams.append(
          "bias",
          `proximity:${parsedInput.bias.lon},${parsedInput.bias.lat}`,
        );
      }

      // Add limit
      searchParams.append("limit", parsedInput.limit.toString());

      // Add offset if provided
      if (parsedInput.offset !== undefined) {
        searchParams.append("offset", parsedInput.offset.toString());
      }

      // Add language if provided
      if (parsedInput.lang) {
        searchParams.append("lang", parsedInput.lang);
      }

      // Add name if provided
      if (parsedInput.name) {
        searchParams.append("name", parsedInput.name);
      }

      const response = await fetch(
        `https://api.geoapify.com/v2/places?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error(2222, response);
        throw new Error(`Response status: ${response.status}`);
      }

      const data: GeoapifyPlacesResponse = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  });

export type SearchPlaces = UnwrapReturn<typeof searchPlaces>;
export { PlaceCondition, PlaceCategory };
