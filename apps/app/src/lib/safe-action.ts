import { cookies } from "next/headers";
import { getUser } from "@mapform/backend/users/get-user";
import { createSafeActionClient } from "next-safe-action";
import { verifyToken } from "@mapform/auth/helpers/sessions";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  const sessionCookie = (await cookies()).get("session")?.value ?? null;

  if (!sessionCookie) {
    throw new Error("User not authenticated.");
  }

  const sessionData = await verifyToken(sessionCookie);

  if (!sessionData.user || !sessionData.expires) {
    throw new Error("Invalid session.");
  }

  if (new Date(sessionData.expires) < new Date()) {
    throw new Error("Session expired.");
  }

  const user = await getUser({ id: sessionData.user.id });

  if (!user) {
    throw new Error("User not found.");
  }

  return next({ ctx: { user, session: sessionData } });
});
