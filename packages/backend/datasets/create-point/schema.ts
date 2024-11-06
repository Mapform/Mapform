import { z } from "zod";
import {
  insertStringCellSchema,
  insertRichtextCellSchema,
  insertPointCellSchema,
} from "@mapform/db/schema";

export const createPointSchema = z.object({
  layerId: z.string(),
  title: insertStringCellSchema.shape.value,
  description: insertRichtextCellSchema.shape.value,
  location: insertPointCellSchema.shape.value,
});

export type CreatePointSchema = z.infer<typeof createPointSchema>;
