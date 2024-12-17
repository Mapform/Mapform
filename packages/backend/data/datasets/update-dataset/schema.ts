import { selectDatasetSchema } from "@mapform/db/schema";
import { z } from "zod";

export const updateDatasetSchema = z
  .object({
    id: selectDatasetSchema.shape.id,
  })
  .merge(selectDatasetSchema.partial().omit({ id: true }));

export type UpdateDatasetSchema = z.infer<typeof updateDatasetSchema>;
