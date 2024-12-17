import { z } from "zod";

export const deleteProjectSchema = z.object({
  projectId: z.string(),
});

export type DeleteProjectSchema = z.infer<typeof deleteProjectSchema>;
