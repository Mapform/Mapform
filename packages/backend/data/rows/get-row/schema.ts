import { z } from "zod/v4";

export const getRowSchema = z.object({
  rowId: z.string(),
});

export type GetRowSchema = z.infer<typeof getRowSchema>;
