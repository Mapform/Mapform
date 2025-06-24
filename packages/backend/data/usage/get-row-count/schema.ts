import { z } from "zod/v4";

export const getRowAndPageCountSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetRowAndPageCountSchema = z.infer<typeof getRowAndPageCountSchema>;
