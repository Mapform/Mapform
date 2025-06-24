import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
});
