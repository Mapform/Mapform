import { tool } from "ai";
import { z } from "zod";
import type { AIResultLocation } from "~/lib/types";

export const returnBestResults = tool({
  description:
    "Return the final evaluated location results to present to the user. ONLY results from the reverseGeocode and autocomplete tools can be passed to this tool. Call this tool exactly once before finishing your response to display the selected location data.",
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
    userQuery: z.string().optional().describe("The user's query."),
  }),
  /**
   * Execute is empty because the ai performs the filtering when assigning the
   * input parameters. After calling this tool, the AI should describe the results
   * in its response to the user.
   */
  execute: async ({ finalResults }) => {
    return finalResults as AIResultLocation[];
  },
});
