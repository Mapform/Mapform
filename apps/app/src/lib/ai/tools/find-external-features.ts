import { tool } from "ai";
import { z } from "zod";
import { publicClient } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findExternalFeatures = tool({
  description:
    "Searches by name for external features (cities, landmarks, restaurants, etc.) using the Geoapify autocomplete API.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The query to search for. Examples: 'Paris France', 'Eiffel Tower', 'McDonalds', 'Hilton Hotel', 'Central Park', 'Times Square', etc.",
      ),
    bounds: z
      .array(z.number())
      .optional()
      .describe(
        "Optional bounds to filter results to a specific geographic area.",
      ),
  }),
  execute: async ({ query, bounds }) => {
    const results = await findExternalFeaturesFunc(query, bounds);
    return results;
  },
});

export async function findExternalFeaturesFunc(
  query: string,
  bounds?: number[],
) {
  try {
    const findExternalFeaturesResults = await publicClient.search({
      query,
      bounds,
    });

    const topResult = findExternalFeaturesResults?.data?.features[0];

    if (!topResult?.properties.gid) {
      return null;
    }

    const placeDetails = await publicClient.details({
      id: topResult.properties.gid,
    });

    const place = placeDetails?.data?.features[0];
    const placeDetailProperties = place?.properties;

    if (!placeDetailProperties) {
      return [];
    }

    const wikidataId =
      placeDetailProperties.addendum?.osm?.wikidata ??
      placeDetailProperties.addendum?.whosonfirstConcordances?.wikidataId ??
      "";

    return [
      {
        id: placeDetailProperties.gid,
        name: topResult.properties.name,
        address: placeDetailProperties.formattedAddressLine ?? "",
        wikidataId: wikidataId,
        coordinates: [
          place.geometry?.coordinates[0],
          place.geometry?.coordinates[1],
        ] as [number, number],
        source: "stadia",
      },
    ] satisfies AIResultLocation[];
  } catch (error) {
    console.error("Error in address findExternalFeatures:", error);
    throw new Error(
      `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export type findExternalFeaturesResponse = NonNullable<
  Awaited<ReturnType<typeof findExternalFeaturesFunc>>
>;
