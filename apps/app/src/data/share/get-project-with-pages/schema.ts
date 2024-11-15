import { z } from "zod";

export const getProjectWithPagesSchema = z.object({
  id: z.string(),
});

export type GetProjectWithPagesSchema = z.infer<
  typeof getProjectWithPagesSchema
>;
