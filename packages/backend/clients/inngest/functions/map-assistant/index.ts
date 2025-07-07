import { rows as rowsSchema } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { inngest } from "../..";
import { openai } from "../../../openai";
import { tools } from "./tools";
import {
  addressAutocomplete,
  calculateRoute,
  type LocationResult,
  type RouteResult,
} from "./tool-functions";

export const mapAssistant = inngest.createFunction(
  { id: "map-assistant" },
  { event: "app/map.assistant" },
  async ({ event, db }) => {
    const { message } = event.data;

    // Can use this to get previous messages
    // const test = await openai.responses.inputItems.list(
    //   "resp_686b3e92cd3c81a285b719ef465870cc0e00f98042ead4a7",
    // );

    // return;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `You are a helpful and knowledgeable map assistant specializing in trip planning, location information, and travel guidance. Your capabilities include:

**Core Functions:**
- Answer general location questions (e.g., "What is the capital of France?", "Where is the Eiffel Tower?")
- Help plan trips and itineraries
- Provide information about cities, landmarks, restaurants, hotels, and points of interest
- Calculate routes between locations (driving, walking, cycling)
- Offer travel tips and recommendations

**How to Use Tools:**
1. **address_autocomplete**: Use this for any location-related questions. Search for cities, landmarks, addresses, businesses, etc. Always use this tool when mentioning specific places to provide accurate location data.

2. **calculate_route**: Use this for trip planning when users want to travel between multiple locations. You can calculate driving, walking, or cycling routes.

**Response Guidelines:**
- Always provide concise, helpful, conversational responses
- When mentioning locations, use the address_autocomplete tool to get precise coordinates and information
- For trip planning, suggest logical routes and use calculate_route when appropriate
- Include practical travel tips and recommendations
- Be enthusiastic and helpful about travel and exploration
- Format location data clearly when presenting it to users
- If a question falls outside of your capabilities, politely decline

**Example Interactions:**
- User: "What's the capital of Japan?" → Use address_autocomplete for "Tokyo Japan" and provide info
- User: "Plan a trip from Paris to London" → Use address_autocomplete for both cities, then calculate_route
- User: "Where can I eat near Times Square?" → Use address_autocomplete for "Times Square" and suggest nearby restaurants

Remember: Always use tools to provide accurate, up-to-date location information rather than relying on general knowledge.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      tools,
      tool_choice: "auto",
    });

    console.log("Resoonse ID: ", response.id);
    console.log("Map Assistant Response:", response.output);

    // For now, return the response directly
    // TODO: Implement proper tool call handling when the API structure is better understood
    return { response: response.output };
  },
);
