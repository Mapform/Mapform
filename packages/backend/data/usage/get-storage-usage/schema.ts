import { z } from "zod";

export const getStorageUsageSchema = z.object({
  workspaceSlug: z.string(),
});

export type GetStorageUsageSchema = z.infer<typeof getStorageUsageSchema>;
