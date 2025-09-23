import type { z } from "zod";
import { insertBlobSchema } from "@mapform/db/schema";

export const updateImageSchema = insertBlobSchema.partial().extend({
  url: insertBlobSchema.shape.url,
});

export type UpdateImageSchema = z.infer<typeof updateImageSchema>;
