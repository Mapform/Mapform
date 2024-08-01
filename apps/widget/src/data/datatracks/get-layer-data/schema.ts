import { z } from "zod";

export const getLayerDataSchema = z.object({
  dataTrackId: z.string(),
  bounds: z.object({
    minLat: z.number(),
    maxLat: z.number(),
    minLng: z.number(),
    maxLng: z.number(),
  }),
});

export type GetLayerDataSchema = z.infer<typeof getLayerDataSchema>;
