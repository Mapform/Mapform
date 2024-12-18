import { z } from "zod";

export const deletePageSchema = z.object({
  pageId: z.string(),
  projectId: z.string(),
  redirect: z.string().optional(),
});

export type DeletePageSchema = z.infer<typeof deletePageSchema>;
