import { z } from "zod";
import { selectBlobSchema } from "@mapform/db/schema";

export const deleteImageSchema = z.object({
  url: selectBlobSchema.shape.url,
});

export type DeleteImageSchema = z.infer<typeof deleteImageSchema>;
