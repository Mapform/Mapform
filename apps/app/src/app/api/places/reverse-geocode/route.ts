import { NextResponse } from "next/server";
import type { ReverseGeocodeResponse } from "@mapform/map-utils/types";
import { env } from "~/env.mjs";

// TODO: We may want to rate limit this, and / or cache the results
export async function GET(request: Request) {
  const lat = new URL(request.url).searchParams.get("lat") ?? "";
  const lng = new URL(request.url).searchParams.get("lng") ?? "";

  try {
    const searchParams = new URLSearchParams({
      apiKey: env.GEOAPIFY_API_KEY,
      lat,
      lng,
    }).toString();

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?${searchParams}`,
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

    const data: ReverseGeocodeResponse = await response.json();

    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json({ msg: "Failure" });
  }
}
