import { NextResponse } from "next/server";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.FOURSQUARE_API_KEY!,
  },
};

// TODO: Rate limit this endpoint, it can get expensive
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query") ?? "";

  try {
    const searchParams = new URLSearchParams({
      query,
    }).toString();

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${searchParams}`,
      options
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
