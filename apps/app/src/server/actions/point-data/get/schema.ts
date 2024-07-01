import { z } from "zod";

export const getPointDataSchema = z.object({
  pointLayerId: z.string(),
  bounds: z.object({
    minLat: z.number(),
    maxLat: z.number(),
    minLng: z.number(),
    maxLng: z.number(),
  }),
});

export type GetPointDataSchema = z.infer<typeof getPointDataSchema>;
