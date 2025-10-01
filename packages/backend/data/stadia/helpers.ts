// LocationIQ Autocomplete response types
import { z } from "zod";

export const BASE_URL = "https://us1.locationiq.com/v1";

// Zod schemas for LocationIQ types
export const locationIqAddressSchema = z.object({
  name: z.string().optional(),
  house_number: z.string().optional(),
  road: z.string().optional(),
  neighbourhood: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  state_code: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
});

export const locationIqSearchItemSchema = z.object({
  place_id: z.string(),
  osm_id: z.string(),
  osm_type: z.string(),
  licence: z.string().optional(),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  boundingbox: z
    .tuple([
      z.coerce.number(),
      z.coerce.number(),
      z.coerce.number(),
      z.coerce.number(),
    ])
    .optional(),
  class: z.string().optional(),
  type: z.string().optional(),
  display_name: z.string(),
  display_place: z.string(),
  display_address: z.string(),
  importance: z.number().optional(),
  address: locationIqAddressSchema.optional(),
  extratags: z.record(z.string()).optional(),
});

export const locationIqFeatureResponseSchema = z.array(
  locationIqSearchItemSchema,
);

export type LocationIqAddressSchema = z.infer<typeof locationIqAddressSchema>;
export type LocationIqSearchItemSchema = z.infer<
  typeof locationIqSearchItemSchema
>;
export type LocationIqFeatureResponseSchema = z.infer<
  typeof locationIqFeatureResponseSchema
>;
