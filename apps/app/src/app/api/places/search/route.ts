import { NextResponse } from "next/server";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";

// TODO: We may want to rate limit this, and / or cache the results
export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("query") ?? "";

  try {
    const searchParams = new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know this is set
      apiKey: process.env.GEOAPIFY_API_KEY!,
      text,
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
