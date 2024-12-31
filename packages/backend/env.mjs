import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    VERCEL_URL: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
  },
  runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "https://alpha.mapform.co",
  },
});
