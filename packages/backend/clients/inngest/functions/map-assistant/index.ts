import { rows as rowsSchema } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { inngest } from "../..";
import { openai } from "../../../openai";
import { tools } from "./tools";

export const mapAssistant = inngest.createFunction(
  { id: "map-assistant" },
  { event: "app/map.assistant" },
  async ({ event, db }) => {
    const { message } = event.data;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "assistant",
          content:
            "You are a helpful mapping assistant. Use tools when needed.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      tools,
      tool_choice: "auto",
    });

    console.log(response);
  },
);
