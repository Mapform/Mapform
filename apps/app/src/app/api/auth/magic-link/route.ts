import { type NextRequest, NextResponse } from "next/server";
import { validateMagicLink } from "@mapform/backend/auth/validate-magic-link";
import { validateMagicLinkSchema } from "@mapform/backend/auth/validate-magic-link/schema";
import type { MagicLinkErrors } from "~/constants/magic-link-errors";
import { env } from "~/env.mjs";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

/**
 * TODO: Rate limit this (e.g. 1 request per minute)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramToken = searchParams.get("token");
  const { token } = validateMagicLinkSchema.parse({ token: paramToken });

  try {
    await validateMagicLink({ token });

    return NextResponse.redirect(`${baseUrl}/app/`);
  } catch (e: unknown) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/app/signin?error=${(e as { type: MagicLinkErrors | null }).type || "unknown"}`,
    );
  }
}
