import { tool } from "ai";
import { z } from "zod";
import { env } from "~/*";

export const autocomplete = tool({
  description:
    "Look up places by name, including cities, landmarks, restaurants, hotels, and points of interest. Use this for general location questions and trip planning.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The query to search for. Examples: 'Paris France', 'Eiffel Tower', 'McDonalds', 'Hilton Hotel', 'Central Park', 'Times Square', etc.",
      ),
    bounds: z
      .array(z.number())
      .optional()
      .describe(
        "Optional bounds to filter results to a specific geographic area.",
      ),
  }),
  execute: async ({ query, bounds }) => {
    const results = await autocompleteFunc(query, bounds);
    return results[0];
  },
});

export interface LocationResult {
  place_id: string;
  name?: string;
  country: string;
  country_code: string;
  region: string;
  state: string;
  city: string;
  lon: number;
  lat: number;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
}

export async function autocompleteFunc(
  query: string,
  bounds?: number[],
): Promise<LocationResult[]> {
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

    const data = (await response.json()) as {
      features: {
        properties: LocationResult;
      }[];
    };

    return data.features
      .filter((feature) => feature.properties)
      .map((feature) => ({
        place_id: feature.properties.place_id,
        name: feature.properties.name,
        country: feature.properties.country,
        country_code: feature.properties.country_code,
        region: feature.properties.region,
        state: feature.properties.state,
        city: feature.properties.city,
        lon: feature.properties.lon,
        lat: feature.properties.lat,
        formatted: feature.properties.formatted,
        address_line1: feature.properties.address_line1,
        address_line2: feature.properties.address_line2,
        category: feature.properties.category,
      }));
  } catch (error) {
    console.error("Error in address autocomplete:", error);
    throw new Error(
      `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
