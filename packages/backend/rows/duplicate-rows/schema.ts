import { z } from "zod";

export const duplicateRowsSchema = z.object({
  rowIds: z.array(z.string()),
});

export type DuplicateRowsSchema = z.infer<typeof duplicateRowsSchema>;
