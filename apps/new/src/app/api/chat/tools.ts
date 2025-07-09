import { tool } from "ai";
import { z } from "zod";
import { addressAutocomplete } from "./tool-functions";

export const tools = {
  addressAutocomplete: tool({
    description:
      "Look up places by name, including cities, landmarks, restaurants, hotels, and points of interest. Use this for general location questions and trip planning. IMPORTANT: This returns multiple results - you should analyze the returned locations and select the most relevant one based on the user's context and the location details (name, category, address, etc.).",
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
    // execute: async ({ query, bounds }) => {
    //   const results = await addressAutocomplete(query, bounds);
    //   console.log("Address autocomplete results:", results);
    //   return {
    //     results,
    //     instructions:
    //       "Review the results and select the most appropriate location based on the user's query. Consider the name, category, address details, and geographic context when making your selection."
    //   };
    // },
  }),
  calculateRoute: tool({
    description:
      "Calculate driving, walking, or cycling routes between multiple locations. Use this for trip planning and navigation.",
    inputSchema: z.object({
      waypoints: z
        .array(
          z
            .array(z.number())
            .describe(
              "Array of coordinates in format [lat,lng] for each waypoint. Must have at least 2 waypoints.",
            ),
        )
        .describe(
          "Array of coordinates in format [lat,lng] for each waypoint. Must have at least 2 waypoints.",
        ),
      mode: z
        .enum(["drive", "walk", "bicycle"])
        .default("drive")
        .describe("Transportation mode for the route calculation."),
    }),
  }),
  // selectBestLocation: tool({
  //   description:
  //     "Select the best location from a list of autocomplete results based on the user's context and requirements. Use this after addressAutocomplete to choose the most appropriate result.",
  //   inputSchema: z.object({
  //     results: z
  //       .array(
  //         z.object({
  //           place_id: z.string(),
  //           name: z.string().optional(),
  //           country: z.string(),
  //           country_code: z.string(),
  //           region: z.string(),
  //           state: z.string(),
  //           city: z.string(),
  //           lon: z.number(),
  //           lat: z.number(),
  //           formatted: z.string(),
  //           address_line1: z.string(),
  //           address_line2: z.string(),
  //           category: z.string(),
  //         }),
  //       )
  //       .describe("Array of location results from addressAutocomplete"),
  //     userContext: z
  //       .string()
  //       .describe(
  //         "The user's original query or context to help determine the best match",
  //       ),
  //     criteria: z
  //       .array(z.string())
  //       .optional()
  //       .describe(
  //         "Optional criteria to prioritize (e.g., ['exact_name_match', 'specific_category', 'geographic_preference'])",
  //       ),
  //   }),
  //   execute: async ({ results, userContext, criteria }) => {
  //     // This tool helps the AI make a decision by providing structured guidance
  //     return {
  //       availableResults: results,
  //       selectionGuidance: {
  //         userContext,
  //         criteria: criteria || [
  //           "relevance",
  //           "specificity",
  //           "geographic_context",
  //         ],
  //         recommendation:
  //           "Analyze each result considering: 1) Name match with user query, 2) Category relevance, 3) Geographic specificity, 4) Address completeness. Select the result that best matches the user's intent.",
  //       },
  //     };
  //   },
  // }),
};
