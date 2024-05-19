import { createSafeActionClient } from "next-safe-action";

export const action: ReturnType<typeof createSafeActionClient> =
  createSafeActionClient();
