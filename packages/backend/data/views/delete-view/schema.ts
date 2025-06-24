import { z } from "zod/v4";

export const deleteViewSchema = z.object({
  viewId: z.string(),
});

export type DeleteViewSchema = z.infer<typeof deleteViewSchema>;
