import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withCSRF } from "@mapform/auth/middleware";
import { verifyToken, setSession } from "@mapform/auth/helpers/sessions";

/**
 * Auto-renew sessions that expire within 12 hours
 */
async function sessionRenewalMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only process session renewal for authenticated routes
  if (!request.nextUrl.pathname.startsWith("/app")) {
    return response;
  }

  const sessionCookie = request.cookies.get("session")?.value;

  if (sessionCookie) {
    try {
      const sessionData = await verifyToken(sessionCookie);

      if (sessionData.user && sessionData.expires) {
        const now = new Date();
        const expiryDate = new Date(sessionData.expires);
        // Renew session if it expires within 12 hours
        const renewalThreshold = new Date(now.getTime() + 12 * 60 * 60 * 1000);

        // Auto-renew sessions that expire within 12 hours
        if (expiryDate > now && expiryDate < renewalThreshold) {
          try {
            // Renew session
            console.log("Renewing session for user:", sessionData.user.id);
            await setSession(sessionData.user.id);
          } catch (error) {
            console.warn("Session renewal failed:", error);
          }
        }
      }
    } catch (error) {
      // If token verification fails, continue normally
      console.warn("Token verification failed during renewal check:", error);
    }
  }

  return response;
}

export default withCSRF(sessionRenewalMiddleware);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
