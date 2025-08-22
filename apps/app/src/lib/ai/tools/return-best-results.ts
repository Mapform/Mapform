import { tool } from "ai";
import { z } from "zod";
import type { AIResultLocation } from "~/lib/types";

export const returnBestResults = tool({
  description:
    "Return the final evaluated location results to present to the user. ONLY results from the reverseGeocode and autocomplete tools can be passed to this tool. The order of the results is important! For example, if a user asked you to plan a trip, results should be ordered chronologically. Call this tool exactly once before finishing your response to display the selected location data.",
  inputSchema: z.object({
    finalResults: z.array(
      z.object({
        id: z.string().describe("The ID of the place."),
        name: z.string().describe("The name of the place."),
        description: z
          .string()
          .optional()
          .describe("The description of the place."),
        wikidata: z
          .string()
          .optional()
          .describe("The Wikidata ID of the place."),
        coordinates: z
          .array(z.number())
          .describe("The coordinates of the place."),
        source: z
          .enum(["geoapify", "mapform"])
          .describe("The source of the place."),
      }),
    ),
    description: z
      .string()
      .optional()
      .describe("Describe your response for the final results."),
  }),
  /**
   * Execute is empty because the ai performs the filtering when assigning the
   * input parameters. After calling this tool, the AI should describe the results
   * in its response to the user.
   */
  execute: ({ finalResults, description }) => {
    return {
      results: finalResults as AIResultLocation[],
      description,
    };
  },
});
