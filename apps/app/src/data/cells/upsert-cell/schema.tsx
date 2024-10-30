import { z } from "zod";
import {
  columnTypeEnum,
  insertCellSchema,
  insertStringCellSchema,
  insertBooleanCellSchema,
  insertNumberCellSchema,
  insertDateCellSchema,
  insertRichtextCellSchema,
  insertPointCellSchema,
} from "@mapform/db/schema";

const commonCellSchema = insertCellSchema;

export const upsertCellSchema = z.discriminatedUnion("type", [
  // String
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[0]),
    value: insertStringCellSchema.shape.value,
  }),
  // bool
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[1]),
    value: insertBooleanCellSchema.shape.value,
  }),
  // number
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[2]),
    value: insertNumberCellSchema.shape.value,
  }),
  // date
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[3]),
    value: insertDateCellSchema.shape.value,
  }),
  // richtext
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[4]),
    value: insertRichtextCellSchema.shape.value,
  }),
  // point
  commonCellSchema.extend({
    type: z.literal(columnTypeEnum.enumValues[5]),
    value: insertPointCellSchema.shape.value,
  }),
]);

export type UpsertCellSchema = z.infer<typeof upsertCellSchema>;
