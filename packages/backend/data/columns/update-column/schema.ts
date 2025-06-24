import { z } from "zod/v4";
import { selectColumnSchema } from "@mapform/db/schema";

export const updateColumnSchema = z.object({
  id: selectColumnSchema.shape.id,
  name: selectColumnSchema.shape.name,
});

export type UpdateColumnSchema = z.infer<typeof updateColumnSchema>;
