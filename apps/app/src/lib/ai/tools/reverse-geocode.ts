import { tool } from "ai";
import { z } from "zod";
import { publicDataService } from "~/lib/safe-action";
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
  const placeDetails = await publicDataService.reverseGeocode({
    lat,
    lng,
  });

  if (!placeDetails?.data) {
    throw new Error("Failed to get place details");
  }

  // Extract the first feature's properties
  const feature = placeDetails.data.features[0];
  // TODO: Handle other geometry types
  if (
    !feature ||
    (!feature.geometry?.coordinates[0] && !feature.geometry?.coordinates[1])
  ) {
    throw new Error("No place details found for the given coordinates");
  }

  const address =
    feature.properties.formattedAddressLine ??
    feature.properties.coarseLocation ??
    undefined;
  const name = feature.properties.name;
  const latitude = feature.geometry.coordinates[0];
  const longitude = feature.geometry.coordinates[1];

  if (!latitude || !longitude) {
    throw new Error("No latitude or longitude found for the given coordinates");
  }

  return [
    {
      id: feature.properties.gid,
      source: "stadia",
      name,
      address,
      latitude,
      longitude,
      confidence: feature.properties.confidence ?? undefined,
    },
  ] satisfies AIResultLocation[];
}

export type ReverseGeocodeResponse = Awaited<
  ReturnType<typeof reverseGeocodeFunc>
>;
