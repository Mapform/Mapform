import { z } from "zod";
import { insertDatasetSchema } from "@mapform/db/schema";

export const createEmptyDatasetSchema = z.object({
  name: insertDatasetSchema.shape.name,
  teamspaceId: insertDatasetSchema.shape.teamspaceId,
});

export type CreateEmptyDatasetSchema = z.infer<typeof createEmptyDatasetSchema>;
