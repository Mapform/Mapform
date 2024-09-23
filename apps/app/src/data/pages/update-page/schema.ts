import { z } from "zod";
import { insertPageSchema } from "@mapform/db/schema";

export const updatePageSchema = z.object({
  id: z.string(),
  title: insertPageSchema.shape.title,
  content: insertPageSchema.shape.content,
});

export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
