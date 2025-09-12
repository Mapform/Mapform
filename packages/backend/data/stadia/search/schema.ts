import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().min(1),
  bounds: z.array(z.number()).optional(),
});

export type SearchSchema = z.infer<typeof searchSchema>;
