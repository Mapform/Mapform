import { EventSchemas, Inngest } from "inngest";
import { mapAssistantEvent } from "./functions/map-assistant/schema";
import { generateEmbeddingsEvent } from "./functions/generate-embeddings/schema";
import { servicesMiddleware } from "./middleware";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "mapform",
  middleware: [servicesMiddleware],
  schemas: new EventSchemas().fromZod([
    mapAssistantEvent,
    generateEmbeddingsEvent,
  ]),
});
