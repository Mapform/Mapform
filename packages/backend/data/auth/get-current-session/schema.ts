import { z } from "zod/v4";

export const getCurrentSessionSchema = z.object({
  token: z.string().nullable().optional(),
});

export type GetCurrentSessionSchema = z.infer<typeof getCurrentSessionSchema>;
