import { z } from "zod";
import {
  insertLayerSchema,
  insertLayersToPagesSchema,
} from "@mapform/db/schema";

export const upsertLayerSchema = z.object({
  id: z.string().optional(),
  datasetId: insertLayerSchema.shape.datasetId,
  color: insertLayerSchema.shape.color,
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
  titleColumnId: insertLayerSchema.shape.titleColumnId,
  descriptionColumnId: insertLayerSchema.shape.descriptionColumnId,
  iconColumnId: insertLayerSchema.shape.iconColumnId,
  pointProperties: z
    .object({
      pointColumnId: z.string(),
    })
    .optional(),
  markerProperties: z
    .object({
      pointColumnId: z.string(),
    })
    .optional(),
  lineProperties: z
    .object({
      lineColumnId: z.string(),
    })
    .optional(),
  polygonProperties: z
    .object({
      polygonColumnId: z.string(),
    })
    .optional(),
});

export type UpsertLayerSchema = z.infer<typeof upsertLayerSchema>;
