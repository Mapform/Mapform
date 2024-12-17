import { z } from "zod";
import { insertDatasetSchema, insertLayerSchema } from "@mapform/db/schema";

export const createEmptyDatasetSchema = z.object({
  name: insertDatasetSchema.shape.name,
  layerType: insertLayerSchema.shape.type.default("point"),
  teamspaceId: insertDatasetSchema.shape.teamspaceId,
});

export type CreateEmptyDatasetSchema = z.infer<typeof createEmptyDatasetSchema>;
