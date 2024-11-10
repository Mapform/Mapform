import { db } from "@mapform/db";
import { sendEmail } from "@mapform/transactional/emails/magic-links";
import { type RequestMagicLinkSchema } from "./schema";
import { magicLinks } from "@mapform/db/schema";
import { generateToken, hashToken } from "@mapform/auth/helpers/tokens";
import { env } from "#env.mjs";

export const requestMagicLink = async ({ email }: RequestMagicLinkSchema) => {
  // 1. Generate token
  const token = generateToken(32);

  // 2. Create magic link record
  await db.insert(magicLinks).values({
    email,
    token: hashToken(token),
    expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
  });

  const baseUrl = env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : "http://localhost:3000";

  // 3. Send the email
  sendEmail({
    to: email,
    // Temp
    link: `${baseUrl}/api/auth/magic-link?token=${token}`,
  });
};