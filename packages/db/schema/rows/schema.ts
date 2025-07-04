import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  customType,
  jsonb,
  vector,
  index,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";
import type { Geometry } from "geojson";
import type { CustomBlock } from "@mapform/blocknote/schema";

// Also export Point type for convenience
export type PointType = { type: "Point"; coordinates: [number, number] };

const geometry = customType<{
  data: Geometry;
}>({
  dataType() {
    return "geometry";
  },
});

export const rows = pgTable(
  "row",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    description: jsonb("description").$type<CustomBlock[]>(),
    icon: varchar("icon", { length: 256 }),
    geometry: geometry("geometry"),

    embedding: vector("row_embedding", { dimensions: 1536 }),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("row_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);
