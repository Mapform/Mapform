import { z } from "zod";

export const updateProjectOrderSchema = z.object({
  teamspaceId: z.string(),
  projectOrder: z.array(z.string()),
});

export type UpdateProjectOrderSchema = z.infer<typeof updateProjectOrderSchema>;
