import { z } from "zod";
import {
  insertLayerSchema,
  insertLayersToPagesSchema,
  insertMarkerLayerSchema,
  insertPointLayerSchema,
} from "@mapform/db/schema";

export const upsertLayerSchema = z.object({
  id: z.string().optional(),
  datasetId: insertLayerSchema.shape.datasetId,
  color: insertLayerSchema.shape.color,
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
  pointProperties: z
    .object({
      color: insertPointLayerSchema.shape.color,
      pointColumnId: z.string(),
      titleColumnId: z.string().nullable(),
      descriptionColumnId: z.string().nullable(),
      iconColumnId: z.string().nullable(),
    })
    .optional(),
  markerProperties: z
    .object({
      color: insertMarkerLayerSchema.shape.color,
      pointColumnId: z.string(),
      titleColumnId: z.string().nullable(),
      descriptionColumnId: z.string().nullable(),
      iconColumnId: z.string().nullable(),
    })
    .optional(),
  lineProperties: z
    .object({
      titleColumnId: z.string().nullable(),
      descriptionColumnId: z.string().nullable(),
      iconColumnId: z.string().nullable(),
      lineColumnId: z.string(),
    })
    .optional(),
  polygonProperties: z
    .object({
      polygonColumnId: z.string(),
      titleColumnId: z.string().nullable(),
      descriptionColumnId: z.string().nullable(),
      iconColumnId: z.string().nullable(),
    })
    .optional(),
});

export type UpsertLayerSchema = z.infer<typeof upsertLayerSchema>;
