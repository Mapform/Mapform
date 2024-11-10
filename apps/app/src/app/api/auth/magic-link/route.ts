import { type NextRequest, NextResponse } from "next/server";
import { validateMagicLink } from "@mapform/backend/auth/validate-magic-link";
import { validateMagicLinkSchema } from "@mapform/backend/auth/validate-magic-link/schema";

/**
 * TODO: Rate limit this (e.g. 1 request per minute)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramToken = searchParams.get("token");
  const { token } = validateMagicLinkSchema.parse({ token: paramToken });

  try {
    await validateMagicLink({ token });

    return NextResponse.redirect("http://localhost:3000/");
  } catch (e) {
    return NextResponse.redirect("http://localhost:3000/signin?error=1");
  }
}
