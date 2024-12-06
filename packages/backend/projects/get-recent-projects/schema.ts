import { z } from "zod";

export const getRecentProjectsSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetRecentProjectsSchema = z.infer<typeof getRecentProjectsSchema>;
