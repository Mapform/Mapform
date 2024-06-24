import { z } from "zod";

export const createDatasetSchema = z.object({
  name: z.string(),
  workspaceId: z.string(),
  data: z.array(z.record(z.string(), z.unknown())),
});

export type CreateDatasetSchema = z.infer<typeof createDatasetSchema>;
