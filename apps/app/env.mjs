import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().url().min(1),

    GEOAPIFY_API_KEY: z.string().min(1),
    VERCEL_URL: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "preview", "production"]),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY: z.string().min(1),
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
    NEXT_PUBLIC_VERCEL_ENV: z.enum(["development", "preview", "production"]),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY,
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "https://mapform.co",
  },
});
