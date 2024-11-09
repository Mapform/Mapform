import { db } from "@mapform/db";
import { sendEmail } from "@mapform/transactional/emails/magic-links";
import { eq, sql } from "@mapform/db/utils";
import { sha256 } from "@oslojs/crypto/sha2";
import { rows, pointLayers, pointCells, magicLinks } from "@mapform/db/schema";
import { encodeBase64NoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { type RequestMagicLinkSchema } from "./schema";

export const requestMagicLink = async ({ email }: RequestMagicLinkSchema) => {
  // 1. Generate a magic link token
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = encodeBase64NoPadding(bytes);

  // 2. Insert magic link token into the database
  await db.insert(magicLinks).values({
    email,
    // Hash token before storing it in the database
    token: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
    expires: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
  });

  // 3. Send the email
  sendEmail({
    to: email,
    // Temp
    link: `http://localhost:3000/api/auth/magic-link/${token}`,
  });
};
