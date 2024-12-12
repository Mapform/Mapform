import { z } from "zod";
import { insertPageSchema } from "@mapform/db/schema";

export const updatePageSchema = z.object({
  id: z.string(),
  icon: insertPageSchema.shape.icon.optional(),
  title: insertPageSchema.shape.title.optional(),
  // Content is recursive, and causes a TS complexity error
  content: insertPageSchema.shape.content.optional() as any,
  center: insertPageSchema.shape.center.optional(),
  zoom: insertPageSchema.shape.zoom.optional(),
  pitch: insertPageSchema.shape.pitch.optional(),
  bearing: insertPageSchema.shape.bearing.optional(),
  contentViewType: insertPageSchema.shape.contentViewType.optional(),
});

export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
