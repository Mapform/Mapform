import { z } from "zod";
import { insertPageSchema } from "@mapform/db/schema";

export const updatePageSchema = z.object({
  id: z.string(),
  title: insertPageSchema.shape.title.optional(),
  content: insertPageSchema.shape.content.optional(),
  center: insertPageSchema.shape.center.optional(),
  zoom: insertPageSchema.shape.zoom.optional(),
  pitch: insertPageSchema.shape.pitch.optional(),
  bearing: insertPageSchema.shape.bearing.optional(),
});

export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
