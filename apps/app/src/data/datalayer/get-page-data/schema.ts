import { z } from "zod";

export const getPageDataSchema = z.object({
  pageId: z.string(),
});

export type GetPageDataSchema = z.infer<typeof getPageDataSchema>;
