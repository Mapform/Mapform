import { z } from "zod";
import {
  insertStringCellSchema,
  insertRichtextCellSchema,
  insertLineCellSchema,
} from "@mapform/db/schema";

export const createLineSchema = z.object({
  layerId: z.string(),
  title: insertStringCellSchema.shape.value,
  description: insertRichtextCellSchema.shape.value,
  value: insertLineCellSchema.shape.value,
});

export type CreateLineSchema = z.infer<typeof createLineSchema>;
