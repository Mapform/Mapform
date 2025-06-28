import {
  columnTypeEnum,
  selectCellSchema,
  selectColumnSchema,
  selectRowSchema,
} from "@mapform/db/schema";
import type { LiteralZodEventSchema } from "inngest";
import { z } from "zod";

export const generateEmbeddingsEvent = z.object({
  name: z.literal("app/generate.embeddings"),
  data: z.object({
    rows: z.array(
      z.object({
        id: selectRowSchema.shape.id,
        name: selectRowSchema.shape.name,
        description: selectRowSchema.shape.description,
        cells: z.array(
          z.object({
            id: selectCellSchema.shape.id,
            columnName: selectColumnSchema.shape.name,
            columnType: z.enum(columnTypeEnum.enumValues),
            value: z.any(),
          }),
        ),
      }),
    ),
  }),
}) satisfies LiteralZodEventSchema;
