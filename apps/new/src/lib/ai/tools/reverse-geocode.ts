import { tool } from "ai";
import { z } from "zod";
import { publicClient } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

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

export async function reverseGeocodeFunc(lat: number, lng: number) {
  const placeDetails = await publicClient.getPlaceDetails({
    type: "coordinates",
    lat,
    lng,
  });

  if (!placeDetails?.data) {
    throw new Error("Failed to get place details");
  }

  // Extract the first feature's properties
  const feature = placeDetails.data.features[0];
  // TODO: Handle other geometry types
  if (!feature || (!feature.properties.lat && !feature.properties.lon)) {
    throw new Error("No place details found for the given coordinates");
  }

  return [
    {
      id: feature.properties.place_id,
      name: feature.properties.name,
      description: feature.properties.address_line1,
      wikidata: feature.properties.datasource?.raw?.wikidata,
      coordinates: [feature.properties.lon, feature.properties.lat] as [
        number,
        number,
      ],
    },
  ] satisfies AIResultLocation[];
}

export type ReverseGeocodeResponse = Awaited<
  ReturnType<typeof reverseGeocodeFunc>
>;
