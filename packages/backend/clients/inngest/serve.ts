import { serve } from "inngest/next";
import { inngest } from "./client";
import { mapAssistant } from "./functions/map-assistant";
import { generateEmbeddings } from "./functions/generate-embeddings";

const functions = [mapAssistant, generateEmbeddings];

export const serveNextjs = () =>
  serve({
    client: inngest,
    functions,
  });
