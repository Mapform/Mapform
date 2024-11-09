import { db } from "@mapform/db";
import { users, workspaceMemberships, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { NextResponse } from "next/server";
import { withCSRF } from "@mapform/auth/middleware";
import { validateSessionToken } from "@mapform/auth/helpers/sessions";

const publicAppPaths = ["/signin"];

export default withCSRF(async (req) => {
  const reqUrl = new URL(req.url);
  const authToken = req.cookies.get("session")?.value ?? null;

  const pathname = req.nextUrl.pathname;

  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isPublicAppPath) {
    return NextResponse.next();
  }

  const result = await validateSessionToken(authToken);

  if (!authToken || !result.session) {
    return NextResponse.redirect(new URL("/signin", reqUrl));
  }

  /**
   * Validate the session token
   * TODO: Should this be cached?
   */

  /**
   * Prevent requests to workspace that the user is not a member of
   */
  if (result.user.id) {
    const workspaceSlug = req.nextUrl.pathname.split("/")[1];
    const hasWorkspaceSlug =
      Boolean(workspaceSlug) && workspaceSlug?.trim() !== "";

    const allowedWorkspaces = await db
      .select()
      .from(workspaceMemberships)
      .innerJoin(users, eq(users.id, workspaceMemberships.userId))
      .innerJoin(
        workspaces,
        eq(workspaces.id, workspaceMemberships.workspaceId),
      )
      .where(eq(users.id, result.user.id));

    if (hasWorkspaceSlug) {
      const hasAccessToWorkspace = allowedWorkspaces.find(
        ({ workspace }) => workspace.slug === workspaceSlug,
      );

      if (!hasAccessToWorkspace) {
        return NextResponse.redirect(new URL("/", reqUrl));
      }
    } else if (allowedWorkspaces.length > 0) {
      const firstWorkspace = allowedWorkspaces[0]?.workspace;

      if (firstWorkspace) {
        return NextResponse.redirect(
          new URL(`/${firstWorkspace.slug}`, reqUrl),
        );
      }

      return NextResponse.redirect(new URL(`/account`, reqUrl));
    }
  }

  /**
   * Redirect to onboarding if the user has not onboarded yet
   */
  if (reqUrl.pathname !== "/onboarding" && !result.user.hasOnboarded) {
    return NextResponse.redirect(new URL(`/onboarding`, reqUrl));
  }

  /**
   * Don't let them go back to onboarding once they've onboarded
   */
  if (reqUrl.pathname === "/onboarding" && result.user.hasOnboarded) {
    return NextResponse.redirect(new URL(`/`, reqUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
