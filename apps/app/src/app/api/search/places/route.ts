import { NextRequest, NextResponse } from "next/server";
import { publicClient } from "~/lib/safe-action";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const bounds = searchParams.get("bounds");

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 },
      );
    }

    const boundsArray = bounds
      ? (bounds.split(",").map(Number) as [number, number, number, number])
      : undefined;

    const searchResults = await publicClient.autocomplete({
      query,
      bounds: boundsArray,
    });

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching places:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 },
    );
  }
}
