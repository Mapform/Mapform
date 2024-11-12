import { type NextRequest, NextResponse } from "next/server";
import { validateMagicLink } from "@mapform/backend/auth/validate-magic-link";
import { validateMagicLinkSchema } from "@mapform/backend/auth/validate-magic-link/schema";
import { env } from "~/env.mjs";

const baseUrl = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "http://localhost:3000";

/**
 * TODO: Rate limit this (e.g. 1 request per minute)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramToken = searchParams.get("token");
  const { token } = validateMagicLinkSchema.parse({ token: paramToken });

  console.log(111111, token);

  try {
    await validateMagicLink({ token });
    console.log(22222);

    return NextResponse.redirect(`${baseUrl}/`);
  } catch (e: unknown) {
    console.log(3333333);
    return NextResponse.redirect(
      `${baseUrl}/signin?error=${(e as { type: string }).type || "unknown"}`,
    );
  }
}
