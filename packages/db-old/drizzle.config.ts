import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "./env.mjs";

config({ path: ".env" });

export default defineConfig({
  schema: "./schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  extensionsFilters: ["postgis"],
});
