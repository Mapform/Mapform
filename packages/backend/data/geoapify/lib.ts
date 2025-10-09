import { z } from "zod";
import axios from "axios";
import { env } from "../../env.mjs";

export const geoapifyClient = axios.create({
  baseURL: "https://api.geoapify.com",
  params: {
    apiKey: env.GEOAPIFY_API_KEY,
  },
});

const basePropertiesSchema = z.object({
  place_id: z.string(),
  lat: z.number(),
  lon: z.number(),
  formatted: z.string(),
  // This is effectively the name of the place
  address_line1: z.string(),
  // This is effectively the address of the place
  address_line2: z.string(),
  category: z.string().optional(),
});

export const geoapifySearchResponseSchema = z.object({
  type: z.string(),
  features: z.array(
    z.object({
      type: z.string(),
      properties: basePropertiesSchema.extend({
        rank: z.object({
          importance: z.number(),
          confidence: z.number(),
          match_type: z.string(),
        }),
      }),
      bbox: z.array(z.number()),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.number()),
      }),
    }),
  ),
});

export const geoapifyForwardResponseSchema = geoapifySearchResponseSchema;
export const geoapifyReverseResponseSchema = geoapifySearchResponseSchema;

export const geoapifyDetailsResponseSchema = z.object({
  type: z.string(),
  features: z.array(
    z.object({
      type: z.string(),
      properties: basePropertiesSchema.extend({
        // TODO: Can add more fields from response as needed here
        opening_hours: z.string().optional(),
        website: z.string().optional(),
        contact: z
          .object({
            phone: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
        datasource: z.object({
          raw: z.object({
            osm_id: z.string().optional(),
            osm_type: z.string().optional(),
          }),
        }),
      }),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.number()),
      }),
    }),
  ),
});
