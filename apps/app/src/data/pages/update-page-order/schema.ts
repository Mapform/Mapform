import { z } from "zod";

export const updatePageOrderSchema = z.object({
  projectId: z.string(),
  pageOrder: z.array(z.string()),
});

export type UpdatePageOrderSchema = z.infer<typeof updatePageOrderSchema>;
