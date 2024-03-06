import { serve } from "inngest/next";
import { inngest } from "~/inngest/client";
import { syncUser } from "~/inngest/sync-user";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUser],
});
