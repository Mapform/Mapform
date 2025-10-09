import { z } from "zod";
import axios from "axios";
import { env } from "../../env.mjs";

export const geoapifyClient = axios.create({
  baseURL: "https://api.geoapify.com/v1",
  params: {
    apiKey: env.GEOAPIFY_API_KEY,
  },
});

export const geoapifyFeatureResponseSchema = z.object({
  name: z.string(),
  formatted: z.string(),
  address_line1: z.string(),
  address_line2: z.string(),
  category: z.string(),
  datasource: z.object({
    sourcename: z.string(),
    attribution: z.string(),
    license: z.string(),
    url: z.string(),
  }),
  rank: z.object({
    importance: z.number(),
    confidence: z.number(),
    confidence_city_level: z.number(),
    match_type: z.string(),
  }),
  lat: z.number(),
  lon: z.number(),
  place_id: z.string(),
});
