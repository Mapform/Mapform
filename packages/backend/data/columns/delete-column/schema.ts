import { z } from "zod/v4";

export const deleteColumnSchema = z.object({
  id: z.string(),
});

export type DeleteColumnSchema = z.infer<typeof deleteColumnSchema>;
