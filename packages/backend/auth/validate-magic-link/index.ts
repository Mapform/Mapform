import jwt from "jsonwebtoken";
import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { sessions, users } from "@mapform/db/schema";
import { setSessionTokenCookie } from "@mapform/auth/helpers/cookies";
import { generateToken } from "@mapform/auth/helpers/tokens";
import { createSession } from "@mapform/auth/helpers/sessions";
import { env } from "../../env.mjs";
import { ValidateMagicLinkSchema } from "./schema";

/**
 * Validate the magic link and create a user (when needed) and session
 */
export const validateMagicLink = async ({ token }: ValidateMagicLinkSchema) => {
  // Verify the token
  const { email } = jwt.verify(token, env.JWT_SECRET) as { email: string };

  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    // Delete session
    await db.delete(sessions).where(eq(sessions.userId, user.id));
  } else {
    [user] = await db.insert(users).values({ email }).returning();

    if (!user) {
      throw new Error("There was an issue upserting the user");
    }
  }

  /**
   * Generate new session
   */
  const sessionToken = generateToken();
  const session = await createSession(sessionToken, user.id);

  await setSessionTokenCookie(sessionToken, session.expires);
};
