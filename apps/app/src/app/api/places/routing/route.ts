import { NextResponse } from "next/server";
import type { GeoapifyRoute } from "@mapform/map-utils/types";
import { env } from "~/env.mjs";
import { getCurrentSession } from "~/data/auth/get-current-session";

type Mode = "drive" | "bicycle" | "walk";

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session?.data?.user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const mode: Mode =
      (new URL(request.url).searchParams.get("mode") as Mode | undefined) ??
      "drive";
    const waypoints = new URL(request.url).searchParams.get("waypoints") ?? "";

    const requestParams = new URLSearchParams({
      apiKey: env.GEOAPIFY_API_KEY,
      format: "json",
      mode,
      waypoints,
    }).toString();

    const response = await fetch(
      `https://api.geoapify.com/v1/routing?${requestParams}`,
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

    const data: GeoapifyRoute = await response.json();

    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json({ msg: "Failure" });
  }
}
