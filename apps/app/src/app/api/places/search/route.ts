import { NextResponse } from "next/server";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import { env } from "~/env.mjs";

// TODO: We may want to rate limit this, and / or cache the results
export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("query") ?? "";
  const bounds = new URL(request.url).searchParams.get("bounds") ?? "";

  try {
    const searchParams = new URLSearchParams({
      apiKey: env.GEOAPIFY_API_KEY,
      text,
      ...(bounds ? { bias: `rect:${bounds}` } : {}),
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

    const data: PlacesSearchResponse = await response.json();

    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json({ msg: "Failure" });
  }
}
