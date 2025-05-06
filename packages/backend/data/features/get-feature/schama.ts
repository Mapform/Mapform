import { z } from "zod";

export const getFeatureSchema = z.object({
  rowId: z.string(),
  layerId: z.string(),
});

export type GetLayerFeatureSchema = z.infer<typeof getFeatureSchema>;
