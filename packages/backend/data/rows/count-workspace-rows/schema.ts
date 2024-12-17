import { z } from "zod";

export const countWorkspaceRowsSchema = z.object({
  workspaceSlug: z.string(),
});

export type CountWorkspaceRowsSchema = z.infer<typeof countWorkspaceRowsSchema>;
