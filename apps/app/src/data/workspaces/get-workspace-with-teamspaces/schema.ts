import { z } from "zod";

export const getWorkspaceWithTeamspacesSchema = z.object({
  slug: z.string(),
});

export type GetWorkspaceWithTeamspacesSchema = z.infer<
  typeof getWorkspaceWithTeamspacesSchema
>;
