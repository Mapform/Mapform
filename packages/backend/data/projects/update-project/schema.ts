import { selectProjectSchema } from "@mapform/db/schema";
import { z } from "zod";

export const updateProjectSchema = z
  .object({
    id: selectProjectSchema.shape.id,
  })
  .merge(selectProjectSchema.partial().omit({ id: true }));

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
