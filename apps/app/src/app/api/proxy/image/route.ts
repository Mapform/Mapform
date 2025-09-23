import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "~/data/auth/get-current-session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  const session = await getCurrentSession();

  if (!session?.data?.user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const parsed = new URL(url);
    const allowedHosts = new Set([
      "commons.wikimedia.org",
      "upload.wikimedia.org",
    ]);

    if (!allowedHosts.has(parsed.hostname)) {
      return new Response("Forbidden host", { status: 400 });
    }

    const upstream = await fetch(url, {
      redirect: "follow",
      headers: {
        // Helps Wikimedia identify the client; adjust as needed
        "User-Agent": "MapForm (localhost)",
      },
      // Don't cache at fetch layer; we'll set headers below
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream error", { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const cacheControl =
      upstream.headers.get("cache-control") ??
      "public, max-age=31536000, immutable";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        ...(contentLength ? { "Content-Length": contentLength } : {}),
      },
    });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
}
