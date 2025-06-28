import { NextRequest, NextResponse } from "next/server";
import { authClient } from "~/lib/safe-action";

export async function POST(request: NextRequest) {
  try {
    const { query, projectId } = await request.json();

    if (!query || !projectId) {
      return NextResponse.json(
        { error: "Missing query or projectId" },
        { status: 400 },
      );
    }

    const searchResults = await authClient.searchRows({
      query,
      projectId,
    });

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching rows:", error);
    return NextResponse.json(
      { error: "Failed to search rows" },
      { status: 500 },
    );
  }
}
