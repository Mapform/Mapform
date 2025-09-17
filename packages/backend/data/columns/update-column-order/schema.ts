import { z } from "zod";

export const updateColumnOrderSchema = z.object({
  projectId: z.string(),
  columnOrder: z.array(z.string()),
});

export type UpdateColumnOrderSchema = z.infer<typeof updateColumnOrderSchema>;