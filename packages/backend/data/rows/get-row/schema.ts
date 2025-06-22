import { z } from "zod";

export const getRowSchema = z.object({
  rowId: z.string(),
});

export type GetRowSchema = z.infer<typeof getRowSchema>;
