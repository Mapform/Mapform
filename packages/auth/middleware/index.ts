import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Manage auth cookie and protect against CSRF attacks by checking the `Origin` header against the `Host` header.
 * More: https://lucia-auth.com/sessions/cookies/nextjs
 */
export const withCSRF = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if (request.method === "GET") {
      return next(request, _next);
    }

    /**
     * CSRF protection only needed for non-GET requests
     */
    const originHeader = request.headers.get("Origin");
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = request.headers.get("Host");

    if (originHeader === null || hostHeader === null) {
      return new NextResponse(null, {
        status: 403,
      });
    }

    let origin: URL;

    try {
      origin = new URL(originHeader);
    } catch {
      return new NextResponse(null, {
        status: 403,
      });
    }

    if (origin.host !== hostHeader) {
      return new NextResponse(null, {
        status: 403,
      });
    }

    return next(request, _next);
  };
};
