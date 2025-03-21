import type { z } from "zod";
import { insertBlobSchema } from "@mapform/db/schema";

export const updateImageSchema = insertBlobSchema.partial().extend({
  url: insertBlobSchema.shape.url,
  workspaceId: insertBlobSchema.shape.workspaceId,
});

export type UpdateImageSchema = z.infer<typeof updateImageSchema>;
