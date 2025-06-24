import { z } from "zod/v4";

export const getWorkspaceDirectorySchema = z.object({
  slug: z.string(),
});

export type GetWorkspaceDirectorySchema = z.infer<
  typeof getWorkspaceDirectorySchema
>;
