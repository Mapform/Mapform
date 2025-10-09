import { z } from "zod";

export const nearbySchema = z.object({
  // https://apidocs.geoapify.com/docs/places/#categories
  categories: z.array(
    z.enum([
      "accommodation",
      "activity",
      "airport",
      "commercial",
      "catering",
      "emergency",
      "education",
      "childcare",
      "entertainment",
      "healthcare",
      "heritage",
      "highway",
      "leisure",
      "man_made",
      "natural",
      "national_park",
      "office",
      "parking",
      "pet",
      "power",
      "production",
      "railway",
      "rental",
      "service",
      "tourism",
      "religion",
      "camping",
      "amenity",
      "beach",
      "adult",
      "building",
      "ski",
      "sport",
      "public_transport",
      "administrative",
      "memorial",
    ]),
  ),
  // conditions: z.enum(["internet_access"]),
  center: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  limit: z.number().min(1).max(100).default(5).optional(),
});

export type NearbySchema = z.infer<typeof nearbySchema>;
