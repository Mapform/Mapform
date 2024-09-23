import { z } from "zod";
import {
  insertLayerSchema,
  insertLayersToPagesSchema,
} from "@mapform/db/schema";

export const createLayerSchema = z.object({
  datasetId: insertLayerSchema.shape.datasetId,
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
});

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
