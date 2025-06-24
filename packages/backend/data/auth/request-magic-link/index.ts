"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { requestMagicLinkSchema } from "./schema";
import type { PublicClient, UnwrapReturn } from "../../../lib/types";
import { sendEmail } from "@mapform/transactional/emails/magic-links";
import { magicLinks } from "@mapform/db/schema";
import { generateToken, hashToken } from "@mapform/auth/helpers/tokens";
import { env } from "../../../env.mjs";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const requestMagicLink = (authClient: PublicClient) =>
  authClient
    .inputSchema(requestMagicLinkSchema)
    .action(async ({ parsedInput: { email } }) => {
      // 1. Generate token
      const token = generateToken(32);

      await db.transaction(async (tx) => {
        // 2. Delete old magic links
        await tx.delete(magicLinks).where(eq(magicLinks.email, email));

        // 3. Create magic link record
        await db
          .insert(magicLinks)
          .values({
            email,
            token: hashToken(token),
            expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
          })
          .returning();
      });

      // 4. Send the email
      await sendEmail({
        to: email,
        // Temp
        link: `${baseUrl}/api/auth/magic-link?token=${token}`,
      });
    });

export type RequestMagicLink = UnwrapReturn<typeof requestMagicLink>;
