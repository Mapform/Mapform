import { env } from "../../../../env.mjs";

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

export interface RouteResult {
  mode: string;
  distance: number;
  time: number;
  waypoints: {
    location: [number, number];
    original_index: number;
  }[];
  legs: {
    distance: number;
    time: number;
    steps: {
      from_index: number;
      to_index: number;
      distance: number;
      time: number;
      instruction: {
        text: string;
      };
    }[];
  }[];
}

export async function addressAutocomplete(
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

    const data = await response.json();

    return data.features
      .filter((feature: any) => feature.properties)
      .map((feature: any) => ({
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

export async function calculateRoute(
  waypoints: [number, number][],
  mode: "drive" | "walk" | "bicycle" = "drive",
): Promise<RouteResult> {
  try {
    if (waypoints.length < 2) {
      throw new Error(
        "At least 2 waypoints are required for route calculation",
      );
    }

    const waypointsString = waypoints
      .map(([lat, lng]) => `${lat},${lng}`)
      .join("|");

    const searchParams = new URLSearchParams({
      apiKey: env.GEOAPIFY_API_KEY,
      format: "json",
      mode,
      waypoints: waypointsString,
    }).toString();

    const response = await fetch(
      `https://api.geoapify.com/v1/routing?${searchParams}`,
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

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No route found between the specified waypoints");
    }

    const result = data.results[0];

    return {
      mode: result.mode,
      distance: result.distance,
      time: result.time,
      waypoints: result.waypoints,
      legs: result.legs,
    };
  } catch (error) {
    console.error("Error in route calculation:", error);
    throw new Error(
      `Failed to calculate route: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
