import { z } from "zod";

export const forwardGeocodeSchema = z.object({
  query: z.string().min(1),
  center: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  limit: z.number().min(1).max(100).default(5).optional(),
});
