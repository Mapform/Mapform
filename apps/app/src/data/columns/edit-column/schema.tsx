import { z } from "zod";
import { selectColumnSchema } from "@mapform/db/schema";

export const editColumnSchema = z.object({
  id: selectColumnSchema.shape.id,
  name: selectColumnSchema.shape.name,
});

export type EditColumnSchema = z.infer<typeof editColumnSchema>;
