import { tool } from "ai";
import { z } from "zod";
import { publicClient } from "~/lib/safe-action";
import {
  PlaceCondition,
  PlaceCategory,
} from "@mapform/backend/data/geoapify/places/enums";

export const searchPlaces = tool({
  description:
    "Search for places and points of interest by category, location, and other criteria. Use this to find restaurants, cafes, museums, hotels, shops, and other amenities. When searching for a single place, use limit 1.",
  inputSchema: z.object({
    categories: z
      .array(z.nativeEnum(PlaceCategory))
      .optional()
      .describe(
        `Categories of places to search for. Available categories: ${Object.values(PlaceCategory).join(", ")}`,
      ),
    conditions: z
      .array(z.nativeEnum(PlaceCondition))
      .optional()
      .describe(
        `Conditions to filter places by. Available conditions: ${Object.values(PlaceCondition).join(", ")}`,
      ),
    location: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        radius: z.number().positive().optional().default(5000),
      })
      .optional()
      .describe(
        "Location to search around. If provided, will search within the specified radius (in meters).",
      ),
    bounds: z
      .array(z.number())
      .length(4)
      .optional()
      .describe("Bounding box to search within [lon1, lat1, lon2, lat2]"),
    name: z.string().optional().describe("Filter places by name"),
    userQuery: z
      .string()
      .optional()
      .describe("The original user query to help with selection"),
    limit: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .default(10)
      .describe("Maximum number of results to return (1-50)"),
  }),
  execute: async ({
    categories,
    conditions,
    location,
    bounds,
    name,
    limit,
  }) => {
    const results = await searchPlacesFunc({
      categories,
      conditions,
      location,
      bounds,
      name,
      limit,
    });

    return results;
  },
});

export async function searchPlacesFunc({
  categories,
  conditions,
  location,
  bounds,
  name,
  limit = 10,
}: {
  categories?: PlaceCategory[];
  conditions?: PlaceCondition[];
  location?: { lat: number; lng: number; radius?: number };
  bounds?: number[];
  name?: string;
  limit?: number;
}) {
  try {
    const searchParams: {
      limit: number;
      categories?: PlaceCategory[];
      conditions?: PlaceCondition[];
      filter?:
        | {
            type: "circle";
            lon: number;
            lat: number;
            radiusMeters: number;
          }
        | {
            type: "rect";
            lon1: number;
            lat1: number;
            lon2: number;
            lat2: number;
          };
      bias?: {
        type: "proximity";
        lon: number;
        lat: number;
      };
      name?: string;
    } = {
      limit,
    };

    // Add categories if provided
    if (categories && categories.length > 0) {
      searchParams.categories = categories;
    }

    // Add conditions if provided
    if (conditions && conditions.length > 0) {
      searchParams.conditions = conditions;
    }

    // Add filter based on location or bounds
    if (location) {
      searchParams.filter = {
        type: "circle",
        lon: location.lng,
        lat: location.lat,
        radiusMeters: location.radius || 5000,
      };
      // Add bias for proximity sorting
      searchParams.bias = {
        type: "proximity",
        lon: location.lng,
        lat: location.lat,
      };
    } else if (
      bounds &&
      bounds.length === 4 &&
      bounds.every((b) => typeof b === "number")
    ) {
      searchParams.filter = {
        type: "rect",
        lon1: bounds[0]!,
        lat1: bounds[1]!,
        lon2: bounds[2]!,
        lat2: bounds[3]!,
      };
    }

    // Add name filter if provided
    if (name) {
      searchParams.name = name;
    }

    const searchResults = await publicClient.searchPlaces(searchParams);

    if (!searchResults?.data) {
      throw new Error("Failed to search places");
    }

    return searchResults.data;
  } catch (error) {
    console.error("Error searching places:", error);
    throw new Error(
      `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
