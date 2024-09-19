import { z } from "zod";

export const getWorkspaceWithTeamsSchema = z.object({
  slug: z.string(),
});

export type GetWorkspaceWithTeamsSchema = z.infer<
  typeof getWorkspaceWithTeamsSchema
>;
