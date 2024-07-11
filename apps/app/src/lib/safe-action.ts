import { auth } from "@clerk/nextjs";
import { createSafeActionClient } from "next-safe-action";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  return next({ ctx: { userId, orgId } });
});
