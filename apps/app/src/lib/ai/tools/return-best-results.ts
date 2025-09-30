import { tool } from "ai";
import { z } from "zod";
import { publicDataService } from "~/lib/safe-action";
import type { AIResultLocation } from "~/lib/types";

export const returnBestResults = tool({
  description:
    "Return the final evaluated location results to present to the user. Only return results that make sense based on the user query. ONLY results from the reverseGeocode, findRawInternalFeatures, and findRawExternalFeatures tools can be passed to this tool. Call this tool exactly once before finishing your response to display the selected location data.",
  inputSchema: z.object({
    finalResults: z.array(
      z.object({
        id: z.string().describe("The location ID."),
        name: z.string().optional().describe("The location name."),
        address: z.string().optional().describe("The location address."),
        latitude: z.number().describe("The location latitude."),
        longitude: z.number().describe("The location longitude."),
        source: z
          .enum(["stadia", "mapform"])
          .describe("The source of the location."),
      }),
    ),
    description: z
      .string()
      .optional()
      .describe("Give an explanation of your choices."),
  }),
  /**
   * Execute is empty because the ai performs the filtering when assigning the
   * input parameters. After calling this tool, the AI should describe the results
   * in its response to the user.
   */
  execute: async ({ finalResults, description }) => {
    const raw = await Promise.all(
      finalResults.map(async (result) => {
        // Enrich Stadia results with metadata
        if (result.source === "stadia") {
          const placeDetails = await publicDataService.details({
            id: result.id,
          });

          const place = placeDetails?.data?.features[0];
          const placeDetailProperties = place?.properties;
          const coordinates = place?.geometry?.coordinates as
            | [number, number]
            | undefined;

          if (!placeDetailProperties || !coordinates) return null;

          const wikidataId =
            placeDetailProperties.addendum?.osm?.wikidata ??
            placeDetailProperties.addendum?.whosonfirstConcordances
              ?.wikidataId ??
            "";

          return {
            source: "stadia",
            id: placeDetailProperties.gid,
            name: placeDetailProperties.name,
            address: placeDetailProperties.formattedAddressLine,
            wikidataId,
            latitude: coordinates[1],
            longitude: coordinates[0],
          } satisfies AIResultLocation;
        }

        // Mapform results pass through
        return result as AIResultLocation;
      }),
    );

    const results = raw.filter((r): r is AIResultLocation => r !== null);

    return { results, description };
  },
});
