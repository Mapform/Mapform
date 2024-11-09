import { db } from "@mapform/db";
import { users, workspaceMemberships, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { NextResponse } from "next/server";
import { withCSRF } from "@mapform/auth/middleware";
import { validateSessionToken } from "@mapform/auth/helpers/sessions";

const publicAppPaths = ["/onboarding", "/static"];

export default withCSRF(async (req) => {
  const reqUrl = new URL(req.url as string);
  const authToken = req.cookies.get("session")?.value ?? null;

  const pathname = req.nextUrl.pathname;

  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path),
  );

  console.log(1111);

  if (!authToken) {
    console.log("No auth token");
    return NextResponse.redirect(
      new URL(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(reqUrl.pathname)}`,
        reqUrl,
      ),
    );
  }

  /**
   * Validate the session token
   * TODO: Should this be cached?
   */
  const session = await validateSessionToken(authToken as string);

  /**
   * Prevent requests to workspace that the user is not a member of
   */
  if (session.user?.id && !isPublicAppPath) {
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
      .where(eq(users.id, session.user.id));

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
  if (reqUrl.pathname !== "/onboarding" && !session.user?.hasOnboarded) {
    return NextResponse.redirect(new URL(`/onboarding`, reqUrl));
  }

  /**
   * Don't let them go back to onboarding once they've onboarded
   */
  if (reqUrl.pathname === "/onboarding" && session.user?.hasOnboarded) {
    return NextResponse.redirect(new URL(`/`, reqUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
