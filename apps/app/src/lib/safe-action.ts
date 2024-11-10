import { cookies } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { getCurrentSession } from "@mapform/auth/helpers/sessions";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  const result = await getCurrentSession(token);

  if (!result.user || !result.session) {
    throw new Error("User not authenticated.");
  }

  return next({ ctx: { user: result.user, session: result.session } });
});
