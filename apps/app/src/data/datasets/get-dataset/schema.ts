import { z } from "zod";

export const getDatasetSchema = z.object({
  datasetId: z.string(),
});

export type GetDatasetSchema = z.infer<typeof getDatasetSchema>;
