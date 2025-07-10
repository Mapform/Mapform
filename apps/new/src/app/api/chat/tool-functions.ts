import { env } from "../../../../env.mjs";

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
