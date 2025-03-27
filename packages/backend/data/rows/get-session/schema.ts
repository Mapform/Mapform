import { selectRowSchema, selectProjectSchema } from "@mapform/db/schema";
import { z } from "zod";

export const getSessionSchema = z.object({
  rowId: selectRowSchema.shape.id,
  projectId: selectProjectSchema.shape.id,
});

export type GetSessionSchema = z.infer<typeof getSessionSchema>;
