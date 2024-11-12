import { createSafeActionClient } from "next-safe-action";
import { getCurrentSession } from "~/data/auth/get-current-session";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  const response = await getCurrentSession();

  return next({ ctx: { user: response?.user, session: response?.session } });
});
