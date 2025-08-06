import { z } from "zod";
import { PlaceCondition, PlaceCategory } from "./enums";

// Filter types for the Places API
const filterSchema = z.union([
  z.object({
    type: z.literal("circle"),
    lon: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
    radiusMeters: z.number().positive(),
  }),
  z.object({
    type: z.literal("rect"),
    lon1: z.number().min(-180).max(180),
    lat1: z.number().min(-90).max(90),
    lon2: z.number().min(-180).max(180),
    lat2: z.number().min(-90).max(90),
  }),
  z.object({
    type: z.literal("geometry"),
    geometryId: z.string().min(1),
  }),
  z.object({
    type: z.literal("place"),
    placeId: z.string().min(1),
  }),
]);

// Bias types for the Places API
const biasSchema = z.object({
  type: z.literal("proximity"),
  lon: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export const placesSchema = z.object({
  categories: z.array(z.nativeEnum(PlaceCategory)).optional(),
  conditions: z.array(z.nativeEnum(PlaceCondition)).optional(),
  filter: filterSchema.optional(),
  bias: biasSchema.optional(),
  limit: z.number().min(1).max(500).optional().default(10),
  offset: z.number().min(0).optional(),
  lang: z.string().length(2).optional(),
  name: z.string().optional(),
});

export type PlacesSchema = z.infer<typeof placesSchema>;
