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
  const coords = feature?.geometry?.coordinates;
  // TODO: Handle other geometry types
  if (
    !feature ||
    !coords ||
    typeof coords[0] !== "number" ||
    typeof coords[1] !== "number"
  ) {
    throw new Error("No place details found for the given coordinates");
  }

  const address =
    feature.properties.formattedAddressLine ??
    feature.properties.coarseLocation ??
    undefined;
  const name = feature.properties.name;
  // GeoJSON coordinates are [longitude, latitude]
  const longitude = coords[0];
  const latitude = coords[1];

  if (typeof latitude !== "number" || typeof longitude !== "number") {
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
    },
  ] satisfies AIResultLocation[];
}

export type ReverseGeocodeResponse = Awaited<
  ReturnType<typeof reverseGeocodeFunc>
>;
