import { z } from "zod/v4";

export const validateMagicLinkSchema = z.object({
  token: z.string(),
});

export type ValidateMagicLinkSchema = z.infer<typeof validateMagicLinkSchema>;
