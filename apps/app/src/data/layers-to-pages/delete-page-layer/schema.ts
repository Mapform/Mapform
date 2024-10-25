import { z } from "zod";

export const deletePageLayerSchema = z.object({
  layerId: z.string(),
  pageId: z.string(),
});

export type DeletePageLayerSchema = z.infer<typeof deletePageLayerSchema>;
