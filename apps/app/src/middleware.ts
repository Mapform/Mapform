export { auth as middleware } from "~/lib/auth";

// export default authMiddleware({
//   // Routes that can be accessed while signed out
//   // publicRoutes: ["/anyone-can-visit-this-route"],

//   // Routes that can always be accessed, and have
//   // no authentication information
//   ignoredRoutes: [
//     "/x/inngest",
//     "/api/inngest",
//     "/.redwood/functions/inngest",
//     "/.netlify/functions/inngest",
//   ],

//   afterAuth(auth, request) {
//     if (!auth.userId && !auth.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: request.url });
//     }
//   },
// });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
