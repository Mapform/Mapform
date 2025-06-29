import { inngest } from "@mapform/backend/clients/inngest";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    if (!message) {
      return NextResponse.json(
        { error: "Missing message parameter" },
        { status: 400 },
      );
    }

    const response = await inngest.send({
      name: "app/map.assistant",
      data: {
        message,
      },
    });

    console.log(111, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error searching places:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 },
    );
  }
}
