import { z } from "zod";

export const forwardGeocodeSchema = z.object({
  query: z.string().min(1),
  bounds: z.array(z.number()).optional(),
});

export type ForwardGeocodeSchema = z.infer<typeof forwardGeocodeSchema>;
