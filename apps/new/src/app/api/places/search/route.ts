import { env } from "~/env.mjs";
import { NextResponse } from "next/server";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

    const data: GeoapifyPlace = await response.json();

    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json({ msg: "Failure" });
  }
}

export interface GeoapifyPlace {
  type: string;
  features: {
    type?: string;
    properties?: {
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
      category: string;
      rank: {
        importance: number;
        confidence: number;
        confidence_city_level: number;
        match_type: string;
      };
      geometry?: {
        type: "Point" | unknown;
        coordinates: [number, number] | unknown;
      };
    };
    bbox?: [number, number, number, number];
  }[];
}
