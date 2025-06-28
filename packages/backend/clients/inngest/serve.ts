import { serve } from "inngest/next";
import { inngest } from "./client";
import { generateEmbeddings } from "./functions/generate-embeddings";

const functions = [generateEmbeddings];

export const serveNextjs = () =>
  serve({
    client: inngest,
    functions,
  });
