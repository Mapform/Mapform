import { z } from "zod";

export const getLayerFeatureSchema = z.object({
  rowId: z.string(),
  layerId: z.string(),
});

export type GetLayerFeatureSchema = z.infer<typeof getLayerFeatureSchema>;
