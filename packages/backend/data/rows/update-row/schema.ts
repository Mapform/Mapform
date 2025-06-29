import { z } from "zod";
import { updateRowSchema as dbUpdateRowSchema } from "@mapform/db/schema";

export const updateRowSchema = z.object({
  id: dbUpdateRowSchema.shape.id,
  name: dbUpdateRowSchema.shape.name,
  description: dbUpdateRowSchema.shape.description,
  icon: dbUpdateRowSchema.shape.icon,
});

export type UpdateRowSchema = z.infer<typeof updateRowSchema>;
