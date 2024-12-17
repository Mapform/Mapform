import { z } from "zod";

export const getCurrentSessionSchema = z.object({
  token: z.string().nullable().optional(),
});

export type GetCurrentSessionSchema = z.infer<typeof getCurrentSessionSchema>;
