import { z } from "zod";

export const deleteColumnSchema = z.object({
  id: z.string(),
});

export type DeleteColumnSchema = z.infer<typeof deleteColumnSchema>;
