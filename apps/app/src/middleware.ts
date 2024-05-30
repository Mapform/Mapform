import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  // publicRoutes: ["/anyone-can-visit-this-route"],

  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/x/inngest",
    "/api/inngest",
    "/.redwood/functions/inngest",
    "/.netlify/functions/inngest",
  ],

  afterAuth(auth, request) {
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/orgs";
      return NextResponse.redirect(url);
    }
  },
});

export const config = {
  // Protects all routes, including api.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
