import { NextResponse } from "next/server";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.FOURSQUARE_API_KEY!,
  },
};

export interface PlacesSearchResponse {
  data: {
    results: {
      fsq_id: string;
      name: string;
      location: {
        address: string;
        country: string;
        cross_street: string;
        formatted_address: string;
        locality: string;
        postcode: string;
        region: string;
      };
      geocodes: {
        main: {
          latitude: number;
          longitude: number;
        };
        roof: {
          latitude: number;
          longitude: number;
        };
      };
      distance: number;
      categories: {
        id: number;
        name: string;
        short_name: string;
        plural_name: string;
        icon: {
          prefix: string;
          suffix: string;
        };
      }[];
    }[];
  };
}

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

    const json: PlacesSearchResponse = await response.json();

    return NextResponse.json({ data: json.data });
  } catch (e: unknown) {
    return NextResponse.json({ msg: "Failure" });
  }
}
