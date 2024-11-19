import z from "zod";
import { createEmptyDatasetSchema } from "@mapform/backend/datasets/create-empty-dataset/schema";

export const extendedCreateEmptyDatasetSchema = createEmptyDatasetSchema.extend(
  {
    redirectAfterCreate: z.boolean().default(false),
  },
);
