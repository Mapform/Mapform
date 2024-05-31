import { auth } from "@clerk/nextjs";
import { createSafeActionClient } from "next-safe-action";

export const authAction = createSafeActionClient({
  middleware() {
    const { userId, orgId } = auth();

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    return { userId, orgId };
  },
});
