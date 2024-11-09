import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().url().min(1),
    VERCEL_ENV: z.string().optional(),
    GEOAPIFY_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
});
