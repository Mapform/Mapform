import { NextResponse } from "next/server";
import { auth, BASE_PATH } from "~/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- This shows an ugly TS error otherwise
export default auth((req) => {
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
}) as ReturnType<typeof auth>;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
