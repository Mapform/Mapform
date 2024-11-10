import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import { sessions, users, type User, type Session } from "@mapform/db/schema";
import { hashToken } from "./tokens";

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = hashToken(token);
  const sessionObject: Session = {
    sessionToken: sessionId,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(sessions).values(sessionObject);
  return sessionObject;
}

export async function validateSessionToken(
  token: string | null,
): Promise<SessionValidationResult> {
  if (!token) {
    return { session: null, user: null };
  }

  const sessionId = hashToken(token);

  // Lookup encoded session token in the database
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.sessionToken, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result[0]!;

  // Check if the session has expired and delete it if it has
  if (Date.now() >= session.expires.getTime()) {
    await db
      .delete(sessions)
      .where(eq(sessions.sessionToken, session.sessionToken));
    return { session: null, user: null };
  }

  // If the session is within 15 days of expiring, update the expiration date
  if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessions)
      .set({
        expires: session.expires,
      })
      .where(eq(sessions.sessionToken, session.sessionToken));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
