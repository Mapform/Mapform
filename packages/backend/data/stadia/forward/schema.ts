import { z } from "zod";

export const forwardGeocodeSchema = z.object({
  query: z.string().min(1),
  bounds: z.array(z.number()).optional(),
  size: z.number().min(1).max(100).default(5).optional(),
});

export type ForwardGeocodeSchema = z.infer<typeof forwardGeocodeSchema>;
