import { z } from "zod/v4";

export const getTeamspaceWithProjectsSchema = z.object({
  workspaceSlug: z.string(),
  teamspaceSlug: z.string(),
});

export type GetTeamspaceWithProjectsSchema = z.infer<
  typeof getTeamspaceWithProjectsSchema
>;
