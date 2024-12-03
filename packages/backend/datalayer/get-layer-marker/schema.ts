import { z } from "zod";

export const getLayerMarkerSchema = z.object({
  rowId: z.string(),
  markerLayerId: z.string(),
});

export type GetLayerMarkerSchema = z.infer<typeof getLayerMarkerSchema>;
