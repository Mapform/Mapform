import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3),
  organizationSlug: z.string(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
