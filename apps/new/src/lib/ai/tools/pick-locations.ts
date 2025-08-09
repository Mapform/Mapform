import { openai } from "@ai-sdk/openai";
import { messages } from "@mapform/db/schema";
import { convertToModelMessages, generateText, tool } from "ai";
import { z } from "zod";

export const pickLocations = tool({
  description:
    "Pass the results from autocomplete, reverseGeocode, and getInformation to finalize the list of places.",
  inputSchema: z.object({
    places: z.array(
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
      }),
    ),
    userQuery: z.string().describe("The user's query."),
  }),
  execute: async ({ places, userQuery }) => {
    // Optionally, you could use another AI call here to do the filtering,
    // but typically, the AI model itself will do this in its reasoning.
    // For now, just return the input (the AI will decide what to send).
    return { relevantPlaces: places };
  },
});
