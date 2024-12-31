import { z } from "zod";

export const deleteProjectSchema = z.object({
  projectId: z.string(),
  redirect: z.string().optional(),
});

export type DeleteProjectSchema = z.infer<typeof deleteProjectSchema>;
