import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
    DATABASE_URL_UNPOOLED: z.string().url().min(1),
    VERCEL_ENV: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
});
