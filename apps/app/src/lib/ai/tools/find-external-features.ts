import { tool } from "ai";
import { z } from "zod";
import { publicClient } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findExternalFeatures = tool({
  description:
    "Forward geocoding (search) endpoint to search for addresses, points of interest, and administrative areas.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The name or address of the place to search for. Examples: 'Paris, France', 'Eiffel Tower', '123 Main St. San Francisco, CA', etc.",
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
    const findExternalFeaturesResults = await publicClient.forwardGeocode({
      query,
      bounds,
    });

    const features = findExternalFeaturesResults?.data?.features ?? [];

    if (!features.length) {
      return [];
    }

    const detailedResults = await Promise.all(
      features.map(async (feature) => {
        const gid = feature.properties.gid;
        if (!gid) return null;

        const placeDetails = await publicClient.details({ id: gid });
        const place = placeDetails?.data?.features[0];
        const placeDetailProperties = place?.properties;
        const coordinates = place?.geometry?.coordinates as
          | [number, number]
          | undefined;

        if (!placeDetailProperties || !coordinates) return null;

        const wikidataId =
          placeDetailProperties.addendum?.osm?.wikidata ??
          placeDetailProperties.addendum?.whosonfirstConcordances?.wikidataId ??
          "";

        return {
          id: placeDetailProperties.gid,
          name: feature.properties.name,
          address:
            placeDetailProperties.formattedAddressLine ??
            placeDetailProperties.coarseLocation ??
            undefined,
          wikidataId,
          coordinates,
          source: "stadia",
        } satisfies AIResultLocation;
      }),
    );

    return detailedResults;
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
