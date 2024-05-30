import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string(),
  organizationSlug: z.string(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
