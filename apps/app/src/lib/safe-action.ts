import { cookies } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { validateSessionToken } from "@mapform/auth/helpers/sessions";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
/**
 * Might not need this -- we can handle auth just through middleware most likely
 */
export const authAction = actionClient.use(async ({ next }) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("session")?.value ?? null;

  return next();

  const result = await validateSessionToken(authToken);

  if (!authToken || !result.session) {
    throw new Error("User not authenticated.");
  }

  return next({ ctx: { user: result.user, session: result.session } });
});
