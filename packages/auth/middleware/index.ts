import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

/**
 * Manage auth cookie and protect against CSRF attacks by checking the `Origin` header against the `Host` header.
 * More: https://lucia-auth.com/sessions/cookies/nextjs
 */
export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if (request.method === "GET") {
      const response = NextResponse.next();
      const token = request.cookies.get("session")?.value ?? null;

      if (token !== null) {
        // Only extend cookie expiration on GET requests since we can be sure
        // a new session wasn't set when handling the request.
        response.cookies.set("session", token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }

      return response;
    }
    /**
     * CSRF protection
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
