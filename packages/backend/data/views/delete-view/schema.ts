import { z } from "zod";

export const deleteViewSchema = z.object({
  viewId: z.string(),
});

export type DeleteViewSchema = z.infer<typeof deleteViewSchema>;
