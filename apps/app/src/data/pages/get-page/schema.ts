import { z } from "zod";

export const getPageSchema = z.object({
  id: z.string(),
});

export type GetPageSchema = z.infer<typeof getPageSchema>;
