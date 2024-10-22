import { z } from "zod";

export const createPageLayerSchema = z.object({
  layerId: z.string(),
  pageId: z.string(),
});

export type CreatePageLayerSchema = z.infer<typeof createPageLayerSchema>;
