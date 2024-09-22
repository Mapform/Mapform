import { z } from "zod";
import { insertPageSchema } from "@mapform/db/schema";

export const createPageSchema = z.object({
  projectId: insertPageSchema.shape.projectId,
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
