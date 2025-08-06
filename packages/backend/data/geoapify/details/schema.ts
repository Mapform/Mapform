import { z } from "zod";

export const placeDetailsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("placeId"),
    placeId: z.string().min(1),
  }),
  z.object({
    type: z.literal("coordinates"),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
]);

export type PlaceDetailsSchema = z.infer<typeof placeDetailsSchema>;
