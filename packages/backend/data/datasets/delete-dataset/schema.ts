import { z } from "zod";

export const deleteDatasetSchema = z.object({
  datasetId: z.string(),
});

export type DeleteDatasetSchema = z.infer<typeof deleteDatasetSchema>;
