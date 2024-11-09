import { createSafeActionClient } from "next-safe-action";
// import { auth } from "~/lib/auth";

// Base client
export const actionClient = createSafeActionClient();

// Auth client
export const authAction = actionClient.use(async ({ next }) => {
  return next();
  // const session = await auth();
  // const userId = session?.user?.id;

  // if (!userId) {
  //   throw new Error("User not authenticated.");
  // }

  // return next({ ctx: { userId } });
});
