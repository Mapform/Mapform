import { serveNextjs } from "@mapform/backend/clients/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serveNextjs();
