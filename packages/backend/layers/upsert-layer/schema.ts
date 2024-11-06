import { z } from "zod";
import {
  insertLayerSchema,
  insertLayersToPagesSchema,
  insertPointLayerSchema,
} from "@mapform/db/schema";

export const upsertLayerSchema = z.object({
  id: z.string().optional(),
  datasetId: insertLayerSchema.shape.datasetId,
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
  pointProperties: z
    .object({
      color: insertPointLayerSchema.shape.color,
      pointColumnId: insertPointLayerSchema.shape.pointColumnId,
      titleColumnId: insertPointLayerSchema.shape.titleColumnId,
      descriptionColumnId: insertPointLayerSchema.shape.descriptionColumnId,
    })
    .optional(),
});

export type UpsertLayerSchema = z.infer<typeof upsertLayerSchema>;
