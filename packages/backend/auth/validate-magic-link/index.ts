import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { magicLinks, sessions, users } from "@mapform/db/schema";
import { setSessionTokenCookie } from "@mapform/auth/helpers/cookies";
import { generateToken, hashToken } from "@mapform/auth/helpers/tokens";
import { createSession } from "@mapform/auth/helpers/sessions";
import { ValidateMagicLinkSchema } from "./schema";

/**
 * Validate the magic link and create a user (when needed) and session
 */
export const validateMagicLink = async ({ token }: ValidateMagicLinkSchema) => {
  // Verify the token
  // const { email } = jwt.verify(token, env.JWT_SECRET) as { email: string };
  const hashedToken = hashToken(token);
  const magicLink = await db.query.magicLinks.findFirst({
    where: eq(magicLinks.token, hashedToken),
  });

  if (!magicLink) {
    throw new Error("Invalid magic link");
  }

  if (Date.now() >= magicLink.expires.getTime()) {
    throw new Error("Magic link expired");
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

    /**
     * Generate new session
     */
    const sessionToken = generateToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expires);
  });
};
