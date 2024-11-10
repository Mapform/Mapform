import { db } from "@mapform/db";
import { sendEmail } from "@mapform/transactional/emails/magic-links";
import { type RequestMagicLinkSchema } from "./schema";
import { magicLinks } from "@mapform/db/schema";
import { generateToken, hashToken } from "@mapform/auth/helpers/tokens";

export const requestMagicLink = async ({ email }: RequestMagicLinkSchema) => {
  // 1. Generate token
  const token = generateToken(32);

  // 2. Create magic link record
  const magicLink = await db.insert(magicLinks).values({
    email,
    token: hashToken(token),
    expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
  });

  // 3. Send the email
  sendEmail({
    to: email,
    // Temp
    link: `http://localhost:3000/api/auth/magic-link?token=${token}`,
  });
};
