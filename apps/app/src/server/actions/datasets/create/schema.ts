import { z } from "zod";

export const createDatasetSchema = z.object({
  name: z.string(),
  workspaceId: z.string(),
});

export type CreateDatasetSchema = z.infer<typeof createDatasetSchema>;
