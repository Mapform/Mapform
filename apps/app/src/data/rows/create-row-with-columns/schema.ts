import { z } from "zod";
import { createRowSchema } from "@mapform/backend/data/rows/create-row/schema";
import { insertBlobSchema } from "@mapform/db/schema";
import { fileSchema } from "@mapform/backend/data/images/upload-image/schema";
import {
  columnTypeEnum,
  insertStringCellSchema,
  insertBooleanCellSchema,
  insertNumberCellSchema,
  insertDateCellSchema,
} from "@mapform/db/schema";

const commonCellSchema = z.object({
  columnName: z.string(),
});

const upsertCellSchema = z.discriminatedUnion("type", [
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
]);

export const createRowWithColumnsSchema = createRowSchema.extend({
  cells: z.array(upsertCellSchema).optional().default([]),
  image: z
    .object({
      file: fileSchema,
      title: insertBlobSchema.shape.title,
      author: insertBlobSchema.shape.author,
      license: insertBlobSchema.shape.license,
    })
    .optional(),
});

export type CreateRowWithColumnsSchema = z.infer<
  typeof createRowWithColumnsSchema
>;
