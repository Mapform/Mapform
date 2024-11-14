import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().url().min(1),
    VERCEL_ENV: z.string().optional(),
    GEOAPIFY_API_KEY: z.string().min(1),
    VERCEL_URL: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "preview", "production"]),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.NODE_ENV === "development" ? "http://localhost:3000" : process.env.VERCEL_ENV === "preview" ? `https://${process.env.VERCEL_URL}` : "https://alpha.mapform.co",
  },
});
