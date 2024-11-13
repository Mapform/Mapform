import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { env } from "./env.mjs";
import * as schema from "./schema";

// Check if websockets exist in the environment
if (WebSocket === undefined) {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });
