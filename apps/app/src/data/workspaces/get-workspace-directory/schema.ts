import { z } from "zod";

export const getWorkspaceDirectorySchema = z.object({
  slug: z.string(),
});

export type getWorkspaceDirectorySchema = z.infer<
  typeof getWorkspaceDirectorySchema
>;
