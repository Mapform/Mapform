import { db } from "@mapform/db";
import { users, workspaceMemberships, workspaces } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { auth, BASE_PATH } from "~/lib/auth";

const publicAppPaths = ["/onboarding", "/static"];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- This shows an ugly TS error otherwise
export default auth(async (req) => {
  console.log(11111, env.DATABASE_URL);
  const reqUrl = new URL(req.url);

  const pathname = req.nextUrl.pathname;

  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!req.auth) {
    return NextResponse.redirect(
      new URL(
        `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(
          reqUrl.pathname,
        )}`,
        req.url,
      ),
    );
  }

  /**
   * Prevent requests to workspace that the user is not a member of
   */
  if (req.auth.user?.id && !isPublicAppPath) {
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
      .where(eq(users.id, req.auth.user.id));

    if (hasWorkspaceSlug) {
      const hasAccessToWorkspace = allowedWorkspaces.find(
        ({ workspace }) => workspace.slug === workspaceSlug,
      );

      if (!hasAccessToWorkspace) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } else if (allowedWorkspaces.length > 0) {
      const firstWorkspace = allowedWorkspaces[0]?.workspace;

      if (firstWorkspace) {
        return NextResponse.redirect(
          new URL(`/${firstWorkspace.slug}`, req.url),
        );
      }

      return NextResponse.redirect(new URL(`/account`, req.url));
    }
  }

  /**
   * Redirect to onboarding if the user has not onboarded yet
   */
  if (reqUrl.pathname !== "/onboarding" && !req.auth.user?.hasOnboarded) {
    return NextResponse.redirect(new URL(`/onboarding`, req.url));
  }

  /**
   * Don't let them go back to onboarding once they've onboarded
   */
  if (reqUrl.pathname === "/onboarding" && req.auth.user?.hasOnboarded) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }
}) as ReturnType<typeof auth>;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
