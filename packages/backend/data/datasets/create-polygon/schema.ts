import { z } from "zod";
import {
  insertStringCellSchema,
  insertRichtextCellSchema,
  insertPolygonCellSchema,
} from "@mapform/db/schema";

export const createPolygonSchema = z.object({
  layerId: z.string(),
  title: insertStringCellSchema.shape.value,
  description: insertRichtextCellSchema.shape.value,
  value: insertPolygonCellSchema.shape.value,
});

export type CreatePolygonSchema = z.infer<typeof createPolygonSchema>;
