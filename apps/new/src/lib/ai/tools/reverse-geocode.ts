import { tool } from "ai";
import { z } from "zod";
import { env } from "~/*";

export const reverseGeocode = tool({
  description: "Look up a location by its latitude and longitude.",
  inputSchema: z.object({
    lat: z.number().describe("The latitude of the location to look up."),
    lng: z.number().describe("The longitude of the location to look up."),
  }),
  execute: async ({ lat, lng }) => {
    const results = await reverseGeocodeFunc(lat, lng);
    return results;
  },
});

export interface LocationResult {
  place_id: string;
  country: string;
  country_code: string;
  region: string;
  state: string;
  city: string;
  lon: number;
  lat: number;
  formatted: string;
  address_line1: string;
  address_line2: string;
}

export async function reverseGeocodeFunc(
  lat: number,
  lng: number,
): Promise<LocationResult> {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${env.GEOAPIFY_API_KEY}`,
  );
  const data = await response.json();

  return data.features[0].properties as LocationResult;
}
