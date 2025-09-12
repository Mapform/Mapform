import { z } from "zod";

export const reverseGeocodeSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type ReverseGeocodeSchema = z.infer<typeof reverseGeocodeSchema>;
