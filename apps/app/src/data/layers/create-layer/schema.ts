import { z } from "zod";
import {
  insertLayerSchema,
  insertLayersToPagesSchema,
  insertPointLayerSchema,
} from "@mapform/db/schema";

export const createLayerSchema = z.object({
  datasetId: insertLayerSchema.shape.datasetId,
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
  pointProperties: z
    .object({
      pointColumnId: insertPointLayerSchema.shape.pointColumnId,
      titleColumnId: insertPointLayerSchema.shape.titleColumnId,
      descriptionColumnId: insertPointLayerSchema.shape.descriptionColumnId,
    })
    .optional(),
});

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
