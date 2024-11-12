import { NextResponse } from "next/server";
import { withCSRF } from "@mapform/auth/middleware";
import { signToken, verifyToken } from "@mapform/auth/helpers/sessions";

const publicAppPaths = ["/signin"];

export default withCSRF(async (request) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value ?? null;
  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path),
  );
  const isProtectedRoute = !isPublicAppPath;

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const workspaceSlug = pathname.split("/")[1];
  const teamspaceSlug = pathname.split("/")[2];

  const requestHeaders = new Headers(request.headers);
  workspaceSlug && requestHeaders.set("x-workspace-slug", workspaceSlug);
  teamspaceSlug && requestHeaders.set("x-teamspace-slug", teamspaceSlug);

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
      if (pathname === "/signin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
    }
  }

  return res;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
