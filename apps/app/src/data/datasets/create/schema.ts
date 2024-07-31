import { z } from "zod";

export const createDatasetSchema = z.object({
  name: z.string().min(3),
  workspaceId: z.string(),
  data: z.array(z.record(z.string(), z.string())),
});

export type CreateDatasetSchema = z.infer<typeof createDatasetSchema>;
