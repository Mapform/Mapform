import { z } from "zod";
import { insertPageSchema } from "@mapform/db/schema";

export const createPageSchema = z.object({
  projectId: insertPageSchema.shape.projectId,
  center: insertPageSchema.shape.center,
  zoom: insertPageSchema.shape.zoom,
  pitch: insertPageSchema.shape.pitch,
  bearing: insertPageSchema.shape.bearing,
  title: insertPageSchema.shape.title,
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
