import { z } from "zod";

export const placeDetailsSchema = z.object({
  placeId: z.string().min(1),
});

export type PlaceDetailsSchema = z.infer<typeof placeDetailsSchema>;
