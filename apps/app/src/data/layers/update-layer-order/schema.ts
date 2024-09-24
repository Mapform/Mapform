import { z } from "zod";

export const updateLayerOrderSchema = z.object({
  pageId: z.string(),
  layerOrder: z.array(z.string()),
});

export type UpdateLayerOrderSchema = z.infer<typeof updateLayerOrderSchema>;
