import { NextResponse } from "next/server";
import { withCSRF } from "@mapform/auth/middleware";
import { signToken, verifyToken } from "@mapform/auth/helpers/sessions";

const publicAppPaths = [
  "/app/signin",
  "/app/signup",
  "/share",
  "/terms-of-use",
  "/privacy-policy",
];

const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== "undefined") {
    host = window.location.host;
  }
  if (host?.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("www")) {
      subdomain = candidate;
    }
  }
  return subdomain;
};

export default withCSRF(async (request) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value ?? null;
  const isPublicAppPath =
    publicAppPaths.some((path) => pathname.startsWith(path)) ||
    pathname === "/";
  const isProtectedRoute = !isPublicAppPath;

  // Handle subdomain routing for share functionality
  const host = request.headers.get("host");
  const subdomain = getValidSubdomain(host);

  console.log("subdomain", subdomain);

  if (subdomain && pathname.startsWith("/share")) {
    const url = request.nextUrl.clone();
    const pathSegments = pathname.split("/").filter(Boolean);
    const pId = pathSegments[1];

    if (pId) {
      url.pathname = `/share/${subdomain}/${pId}`;
      return NextResponse.rewrite(url);
    }
  }

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/app/signin", request.url));
  }

  const workspaceSlug = pathname.split("/")[2];
  const teamspaceSlug = pathname.split("/")[3];

  const requestHeaders = new Headers(request.headers);

  if (workspaceSlug) {
    requestHeaders.set("x-workspace-slug", workspaceSlug);
  }
  if (teamspaceSlug) {
    requestHeaders.set("x-teamspace-slug", teamspaceSlug);
  }

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: "session",
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiresInOneDay,
      });

      /**
       * Redirect to root if already signed in
       */
      if (pathname === "/app/signin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/app/signin", request.url));
      }
    }
  }

  return res;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
