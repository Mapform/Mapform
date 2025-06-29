import type { Tool } from "openai/resources/responses/responses.mjs";

export const tools: Tool[] = [
  {
    type: "function",
    name: "address_autocomplete",
    description:
      "Look up places by name, including cities, landmarks, restaurants, hotels, and points of interest. Use this for general location questions and trip planning.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The query to search for. Examples: 'Paris France', 'Eiffel Tower', 'McDonalds', 'Hilton Hotel', 'Central Park', 'Times Square', etc.",
        },
        bounds: {
          type: ["array", "null"],
          description:
            "Optional bounds to filter results to a specific geographic area.",
          items: { type: "number" },
        },
      },
      required: ["query", "bounds"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function",
    name: "calculate_route",
    description:
      "Calculate driving, walking, or cycling routes between multiple locations. Use this for trip planning and navigation.",
    parameters: {
      type: "object",
      properties: {
        waypoints: {
          type: "array",
          description:
            "Array of coordinates in format [lat,lng] for each waypoint. Must have at least 2 waypoints.",
          items: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
          },
        },
        mode: {
          type: "string",
          description: "Transportation mode for the route calculation.",
          enum: ["drive", "walk", "bicycle"],
          default: "drive",
        },
      },
      additionalProperties: false,
      required: ["waypoints", "mode"],
    },
    strict: true,
  },
];
