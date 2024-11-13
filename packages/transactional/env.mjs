import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    VERCEL_URL: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "production"]),
  },
  client: {
  },
  runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
});
