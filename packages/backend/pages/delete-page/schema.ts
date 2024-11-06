import { z } from "zod";

export const deletePageSchema = z.object({
  pageId: z.string(),
  projectId: z.string(),
});

export type DeletePageSchema = z.infer<typeof deletePageSchema>;
