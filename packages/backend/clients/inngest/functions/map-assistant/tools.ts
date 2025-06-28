import type { Tool } from "openai/resources/responses/responses.mjs";

export const tools: Tool[] = [
  {
    type: "function",
    name: "address_autocomplete",
    description: "Look up places by name.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The query to search for. eg. 123 Main St., Ikea, McDonalds, etc",
        },
        bounds: {
          type: "array",
          description: "Optional bounds to filter results.",
          items: { type: "number" },
        },
      },
      required: ["query"],
    },
    strict: true,
  },
];
