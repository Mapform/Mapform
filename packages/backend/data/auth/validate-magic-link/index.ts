"server-only";

import { eq } from "@mapform/db/utils";
import { validateMagicLinkSchema } from "./schema";
import type { PublicClient } from "../../../lib/types";
import { magicLinks, users } from "@mapform/db/schema";
import { hashToken } from "@mapform/auth/helpers/tokens";
import { setSession } from "@mapform/auth/helpers/sessions";
import { ServerError } from "../../../lib/server-error";
import { Resend } from "resend";
import { env } from "../../../env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export const validateMagicLink = (authClient: PublicClient) =>
  authClient
    .schema(validateMagicLinkSchema)
    .action(async ({ parsedInput: { token }, ctx: { db } }) => {
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

      const isNewUser = !user;

      await db.transaction(async (tx) => {
        // If no user exists, create one
        if (!user) {
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

      console.log("isNewUser", isNewUser);
      console.log("user", user);

      // Create Resend contact for new users
      if (isNewUser && user) {
        try {
          await resend.contacts.create({
            email: user.email,
            audienceId: env.RESEND_AUDIENCE_ID,
          });

          console.log("Resend contact created");
        } catch (error) {
          // Log error but don't fail user creation
          console.error("Failed to create Resend contact:", error);
        }
      }

      if (!user) {
        throw new Error("There was an issue upserting the user");
      }

      /**
       * Generate new session
       */
      await setSession(user.id);
    });
