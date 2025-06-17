import { z } from "zod";
import { insertRowSchema } from "@mapform/db/schema";

export const createManyRowsSchema = z.object({
  projectId: insertRowSchema.shape.projectId,
  rows: z.array(insertRowSchema.omit({ projectId: true })),
});

export type CreateManyRowsSchema = z.infer<typeof createManyRowsSchema>;
