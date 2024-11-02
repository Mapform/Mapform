import { z } from "zod";

export const listTeamspaceDatasetsSchema = z.object({
  workspaceSlug: z.string(),
  teamspaceSlug: z.string(),
});

export type ListAvailableDatasetsSchema = z.infer<
  typeof listTeamspaceDatasetsSchema
>;
