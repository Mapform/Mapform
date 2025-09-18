import { z } from "zod";
import {
  columnTypeEnum,
  insertCellSchema,
  insertStringCellSchema,
  insertBooleanCellSchema,
  insertNumberCellSchema,
  insertDateCellSchema,
} from "@mapform/db/schema";

const commonCellSchema = insertCellSchema
  .pick({
    rowId: true,
  })
  .extend({
    columnId: insertCellSchema.shape.columnId.optional(),
    columnName: z.string().optional(),
  });

const upsertCellBase = z.discriminatedUnion("type", [
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

export const upsertCellSchema = upsertCellBase.superRefine((val, ctx) => {
  const provided = (val.columnId ? 1 : 0) + (val.columnName ? 1 : 0);
  if (provided !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provide either columnId or columnName",
      path: ["columnId"],
    });
  }
});

export type UpsertCellSchema = z.infer<typeof upsertCellSchema>;
