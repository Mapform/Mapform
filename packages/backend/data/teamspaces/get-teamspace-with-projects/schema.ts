import { z } from "zod";

export const getTeamspaceWithProjectsSchema = z.object({
  workspaceSlug: z.string(),
  teamspaceSlug: z.string(),
});

export type GetTeamspaceWithProjectsSchema = z.infer<
  typeof getTeamspaceWithProjectsSchema
>;
