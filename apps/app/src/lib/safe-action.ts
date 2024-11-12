import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/data/auth/get-current-session";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  const response = await getCurrentSession();

  if (!response?.user) {
    redirect("/signin");
  }

  return next({ ctx: { user: response.user, session: response.session } });
});
