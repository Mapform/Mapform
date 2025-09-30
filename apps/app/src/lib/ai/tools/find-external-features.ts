import { tool } from "ai";
import { z } from "zod";
import { publicDataService } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const findRawExternalFeatures = tool({
  description:
    "Forward geocoding (search) endpoint to search for addresses, points of interest, and administrative areas.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The name or address of the place to search for. Queries must be kept simple. GOOD QUERY examples: 'Paris, France', 'Eiffel Tower', '123 Main St. San Francisco, CA', etc. BAD QUERY examples: 'Restaurants near Mile End Montreal', 'Maman Jeanne Montreal Ethiopian Restaurant address'.",
      ),
    bounds: z
      .array(z.number())
      .optional()
      .describe(
        "Optional bounds to filter results to a specific geographic area.",
      ),
    center: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional()
      .describe(
        "Optional center to bias results towards a specific geographic area.",
      ),
  }),
  execute: async ({ query, bounds }) => {
    const results = await findRawExternalFeaturesFunc(query, bounds);
    return results;
  },
});

export async function findRawExternalFeaturesFunc(
  query: string,
  bounds?: number[],
  center?: { lat: number; lng: number },
) {
  try {
    const findRawExternalFeaturesResults =
      await publicDataService.forwardGeocode({
        query,
        bounds,
        center,
      });

    const features = findRawExternalFeaturesResults?.data?.features ?? [];

    if (!features.length) {
      return [];
    }

    const detailedResults = features.map((feature) => {
      const gid = feature.properties.gid;
      if (!gid) return null;

      const latitude = feature.geometry?.coordinates[0];
      const longitude = feature.geometry?.coordinates[1];
      const address =
        feature.properties.formattedAddressLine ??
        feature.properties.coarseLocation ??
        undefined;

      if (!latitude || !longitude) {
        throw new Error(
          "No latitude or longitude found for the given coordinates",
        );
      }

      return {
        id: gid,
        name: feature.properties.name,
        address,
        latitude,
        longitude,
        source: "stadia",
      } satisfies AIResultLocation;
    });

    console.debug("findRawExternalFeatures query: ", query);
    console.debug("findRawExternalFeatures detailedResults: ", detailedResults);

    return detailedResults;
  } catch (error) {
    console.error("Error in address findRawExternalFeatures:", error);
    throw new Error(
      `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export type findRawExternalFeaturesResponse = NonNullable<
  Awaited<ReturnType<typeof findRawExternalFeaturesFunc>>
>;
