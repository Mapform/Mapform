import { z } from "zod/v4";

export const requestMagicLinkSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export type RequestMagicLinkSchema = z.infer<typeof requestMagicLinkSchema>;
