import { z } from "zod";
import axios from "axios";
import { env } from "../../env.mjs";

export const geoapifyClient = axios.create({
  baseURL: "https://api.geoapify.com",
  params: {
    apiKey: env.GEOAPIFY_API_KEY,
  },
});

export const geoapifyFeatureResponseSchema = z.object({
  type: z.string(),
  features: z.array(
    z.object({
      type: z.string(),
      properties: z.object({
        place_id: z.string(),
        lat: z.number(),
        lon: z.number(),
        formatted: z.string(),
        address_line1: z.string(),
        address_line2: z.string(),
        category: z.string().optional(),
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
