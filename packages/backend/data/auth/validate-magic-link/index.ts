"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { validateMagicLinkSchema } from "./schema";
import type { PublicClient } from "../../../lib/types";
import { magicLinks, sessions, users } from "@mapform/db/schema";
import { hashToken } from "@mapform/auth/helpers/tokens";
import { setSession } from "@mapform/auth/helpers/sessions";
import { ServerError } from "../../../lib/server-error";

export const validateMagicLink = (authClient: PublicClient) =>
  authClient
    .schema(validateMagicLinkSchema)
    .action(async ({ parsedInput: { token } }) => {
      // Verify the token
      // const { email } = jwt.verify(token, env.JWT_SECRET) as { email: string };
      const hashedToken = hashToken(token);
      const magicLink = await db.query.magicLinks.findFirst({
        where: eq(magicLinks.token, hashedToken),
      });

      if (!magicLink) {
        throw new ServerError("not-found");
      }

      if (Date.now() >= magicLink.expires.getTime()) {
        throw new ServerError("expired");
      }

      let user = await db.query.users.findFirst({
        where: eq(users.email, magicLink.email.toLocaleLowerCase()),
      });

      await db.transaction(async (tx) => {
        if (user) {
          // Delete session
          await tx.delete(sessions).where(eq(sessions.userId, user.id));
        } else {
          [user] = await tx
            .insert(users)
            .values({ email: magicLink.email.toLocaleLowerCase() })
            .returning();

          if (!user) {
            throw new Error("There was an issue upserting the user");
          }
        }

        // Delete magic link
        await tx.delete(magicLinks).where(eq(magicLinks.token, hashedToken));
      });

      if (!user) {
        throw new Error("There was an issue upserting the user");
      }

      /**
       * Generate new session
       */
      await setSession(user);
    });
