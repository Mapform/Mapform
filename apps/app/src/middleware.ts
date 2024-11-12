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

  return NextResponse.next();

  // const reqUrl = new URL(req.url);
  // const authToken = req.cookies.get("session")?.value ?? null;
  // const pathname = req.nextUrl.pathname;
  // /**
  //  * Redirect to onboarding if the user has not onboarded yet
  //  */
  // if (!result.user.hasOnboarded) {
  //   if (reqUrl.pathname !== "/onboarding") {
  //     return NextResponse.redirect(new URL(`/onboarding`, reqUrl));
  //   }
  //   return NextResponse.next();
  // }
  // /**
  //  * Don't let them go back to onboarding once they've onboarded
  //  */
  // if (reqUrl.pathname === "/onboarding") {
  //   return NextResponse.redirect(new URL(`/`, reqUrl));
  // }
  // /**
  //  * Prevent requests to workspace that the user is not a member of
  //  */
  // if (result.user.id) {
  //   const workspaceSlug = req.nextUrl.pathname.split("/")[1];
  //   const hasWorkspaceSlug =
  //     Boolean(workspaceSlug) && workspaceSlug?.trim() !== "";
  //   const allowedWorkspaces = await db
  //     .select()
  //     .from(workspaceMemberships)
  //     .innerJoin(users, eq(users.id, workspaceMemberships.userId))
  //     .innerJoin(
  //       workspaces,
  //       eq(workspaces.id, workspaceMemberships.workspaceId),
  //     )
  //     .where(eq(users.id, result.user.id));
  //   if (hasWorkspaceSlug) {
  //     const hasAccessToWorkspace = allowedWorkspaces.find(
  //       ({ workspace }) => workspace.slug === workspaceSlug,
  //     );
  //     if (!hasAccessToWorkspace) {
  //       return NextResponse.redirect(new URL("/", reqUrl));
  //     }
  //   } else if (allowedWorkspaces.length > 0) {
  //     const firstWorkspace = allowedWorkspaces[0]?.workspace;
  //     if (firstWorkspace) {
  //       return NextResponse.redirect(
  //         new URL(`/${firstWorkspace.slug}`, reqUrl),
  //       );
  //     }
  //     return NextResponse.redirect(new URL(`/account`, reqUrl));
  //   }
  // }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
