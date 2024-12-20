import { z } from "zod";

export const getRowAndPageCountSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetRowAndPageCountSchema = z.infer<typeof getRowAndPageCountSchema>;
