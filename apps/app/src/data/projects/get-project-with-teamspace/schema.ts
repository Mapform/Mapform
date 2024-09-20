import { z } from "zod";

export const getProjectWithTeamspaceSchema = z.object({
  id: z.string(),
});

export type GetProjectWithTeamspaceSchema = z.infer<
  typeof getProjectWithTeamspaceSchema
>;
