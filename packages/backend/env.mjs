import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    VERCEL_URL: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
  },
  runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_BASE_URL: process.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? `https://${process.env.VERCEL_URL}` : "https://alpha.mapform.co",
  },
});
