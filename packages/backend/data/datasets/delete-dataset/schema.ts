import { z } from "zod";

export const deleteDatasetSchema = z.object({
  datasetId: z.string(),
  redirect: z.string().optional(),
});

export type DeleteDatasetSchema = z.infer<typeof deleteDatasetSchema>;
