import { z } from "zod/v4";

export const getStorageUsageSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetStorageUsageSchema = z.infer<typeof getStorageUsageSchema>;
