import { tool } from "ai";
import { z } from "zod";
import { publicClient } from "~/lib/safe-action";

export const autocomplete = tool({
  description:
    "Look up places by name, including cities, landmarks, restaurants, hotels, and points of interest. Use this for general location questions and trip planning.",
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
    const results = await autocompleteFunc(query, bounds);
    return results;
  },
});

export async function autocompleteFunc(query: string, bounds?: number[]) {
  try {
    const placeDetails = await publicClient.autocomplete({
      query,
      bounds,
    });

    const topResult = placeDetails?.data?.features[0];

    if (!topResult?.properties?.place_id) {
      return null;
    }

    return publicClient.getPlaceDetails({
      type: "placeId",
      placeId: topResult.properties.place_id,
    });
  } catch (error) {
    console.error("Error in address autocomplete:", error);
    throw new Error(
      `Failed to search places: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export type AutocompleteResponse = NonNullable<
  Awaited<ReturnType<typeof autocompleteFunc>>
>;
