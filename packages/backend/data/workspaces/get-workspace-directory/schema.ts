import { z } from "zod";

export const getWorkspaceDirectorySchema = z.object({
  slug: z.string(),
});

export type GetWorkspaceDirectorySchema = z.infer<
  typeof getWorkspaceDirectorySchema
>;
