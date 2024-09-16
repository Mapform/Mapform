import { z } from "zod";

export const createDatasetFromCSVSchema = z.object({
  name: z.string().min(3),
  workspaceId: z.string(),
  data: z.array(z.record(z.string(), z.string())),
});

export type CreateDatasetFromCSVSchema = z.infer<
  typeof createDatasetFromCSVSchema
>;
