import { tool } from "ai";
import { z } from "zod";
import type { AIResultLocation } from "~/lib/types";

export const returnBestResults = tool({
  description:
    "Return only the best evaluated location results after reviewing all tool outputs.",
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
      }),
    ),
    userQuery: z.string().describe("The user's query."),
  }),
  /**
   * Execute is empty because the ai performs the filtering when assigning the
   * input parameters.
   */
  execute: async ({ finalResults }) => {
    return finalResults as AIResultLocation[];
  },
});
