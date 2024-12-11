import { z } from "zod";

export const getWorkspaceSchema = z.object({
  slug: z.string(),
});

export type GetWorkspaceSchema = z.infer<typeof getWorkspaceSchema>;
