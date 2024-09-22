import { z } from "zod";

export const getPageWithDataSchema = z.object({
  id: z.string(),
});

export type GetPageWithDataSchema = z.infer<typeof getPageWithDataSchema>;
