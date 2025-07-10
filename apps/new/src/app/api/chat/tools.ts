import { tool } from "ai";
import { z } from "zod";

export const tools = {
  // address_autocomplete: tool({
  //   description:
  //     "Look up places by name, including cities, landmarks, restaurants, hotels, and points of interest. Use this for general location questions and trip planning.",
  //   inputSchema: z.object({
  //     query: z
  //       .string()
  //       .describe(
  //         "The query to search for. Examples: 'Paris France', 'Eiffel Tower', 'McDonalds', 'Hilton Hotel', 'Central Park', 'Times Square', etc.",
  //       ),
  //     bounds: z
  //       .array(z.number())
  //       .optional()
  //       .describe(
  //         "Optional bounds to filter results to a specific geographic area.",
  //       ),
  //   }),
  //   execute: async ({ query, bounds }) => {
  //     console.log("query", query);
  //     const results = await addressAutocomplete(query, bounds);
  //     console.log("results", results);
  //     return results;
  //   },
  // }),
  // selectBestLocation: tool({
  //   description:
  //     "Select the closest match from a list of autocomplete results based on the user's query. You should return one item from the array.",
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
  //   }),
  // }),
  // calculateRoute: tool({
  //   description:
  //     "Calculate driving, walking, or cycling routes between multiple locations. Use this for trip planning and navigation.",
  //   inputSchema: z.object({
  //     waypoints: z
  //       .array(
  //         z
  //           .array(z.number())
  //           .describe(
  //             "Array of coordinates in format [lat,lng] for each waypoint. Must have at least 2 waypoints.",
  //           ),
  //       )
  //       .describe(
  //         "Array of coordinates in format [lat,lng] for each waypoint. Must have at least 2 waypoints.",
  //       ),
  //     mode: z
  //       .enum(["drive", "walk", "bicycle"])
  //       .default("drive")
  //       .describe("Transportation mode for the route calculation."),
  //   }),
  // }),
};
