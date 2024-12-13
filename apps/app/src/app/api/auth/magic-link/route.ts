import { type NextRequest, NextResponse } from "next/server";
import { publicClient } from "~/lib/safe-action";
import { env } from "~/env.mjs";
import { MagicLinkErrors } from "~/constants/magic-link-errors";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

/**
 * TODO: Rate limit this (e.g. 1 request per minute)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    throw new Error("Token is required");
  }

  const response = await publicClient.validateMagicLink({ token });

  if (response?.validationErrors) {
    return NextResponse.redirect(`${baseUrl}/app/signin?error=unknown`);
  }

  if (response?.serverError) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/app/signin?error=${(response.serverError as MagicLinkErrors) || "unknown"}`,
    );
  }

  return NextResponse.redirect(`${baseUrl}/app/`);
}
