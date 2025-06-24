import { z } from "zod/v4";

export const deleteRowsSchema = z.object({
  rowIds: z.array(z.string()),
});

export type DeleteRowsSchema = z.infer<typeof deleteRowsSchema>;
