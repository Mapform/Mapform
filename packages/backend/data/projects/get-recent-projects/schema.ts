import { z } from "zod/v4";

export const getRecentProjectsSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetRecentProjectsSchema = z.infer<typeof getRecentProjectsSchema>;
