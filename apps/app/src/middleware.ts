import { prisma } from "@mapform/db";
import { NextResponse } from "next/server";
import { auth, BASE_PATH } from "~/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- This shows an ugly TS error otherwise
export default auth(async (req) => {
  const reqUrl = new URL(req.url);

  if (!req.auth) {
    return NextResponse.redirect(
      new URL(
        `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(
          reqUrl.pathname
        )}`,
        req.url
      )
    );
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

  /**
   * Redirect root to account
   */
  if (reqUrl.pathname === "/" || reqUrl.pathname === "/orgs") {
    const userWithOrgs = await prisma.user.findUnique({
      where: { id: req.auth.user?.id },
      include: {
        organizationMemberships: {
          include: {
            organization: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });
    const firstOrg = userWithOrgs?.organizationMemberships[0]?.organization;

    if (firstOrg) {
      return NextResponse.redirect(new URL(`/orgs/${firstOrg.slug}`, req.url));
    }

    return NextResponse.redirect(new URL(`/account`, req.url));
  }
}) as ReturnType<typeof auth>;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
