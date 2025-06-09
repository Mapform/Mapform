import { z } from "zod";
import {
  insertStringCellSchema,
  insertRichtextCellSchema,
  insertLineCellSchema,
  lineCellTypeEnum,
} from "@mapform/db/schema";

export const createLineSchema = z.object({
  layerId: z.string(),
  title: insertStringCellSchema.shape.value,
  description: insertRichtextCellSchema.shape.value,
  value: insertLineCellSchema.shape.value,
  type: z.enum(lineCellTypeEnum.enumValues).optional(),
});

export type CreateLineSchema = z.infer<typeof createLineSchema>;
