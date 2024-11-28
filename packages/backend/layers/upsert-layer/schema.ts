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
  pageId: insertLayersToPagesSchema.shape.pageId,
  name: insertLayerSchema.shape.name,
  type: insertLayerSchema.shape.type,
  pointProperties: z
    .object({
      color: insertPointLayerSchema.shape.color,
      pointColumnId: insertPointLayerSchema.shape.pointColumnId,
      titleColumnId: insertPointLayerSchema.shape.titleColumnId,
      descriptionColumnId: insertPointLayerSchema.shape.descriptionColumnId,
      iconColumnId: insertMarkerLayerSchema.shape.iconColumnId,
    })
    .optional(),
  markerProperties: z
    .object({
      color: insertMarkerLayerSchema.shape.color,
      pointColumnId: insertMarkerLayerSchema.shape.pointColumnId,
      titleColumnId: insertMarkerLayerSchema.shape.titleColumnId,
      descriptionColumnId: insertMarkerLayerSchema.shape.descriptionColumnId,
      iconColumnId: insertMarkerLayerSchema.shape.iconColumnId,
    })
    .optional(),
});

export type UpsertLayerSchema = z.infer<typeof upsertLayerSchema>;
