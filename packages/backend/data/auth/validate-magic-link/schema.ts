import { z } from "zod";

export const validateMagicLinkSchema = z.object({
  token: z.string(),
});

export type ValidateMagicLinkSchema = z.infer<typeof validateMagicLinkSchema>;
