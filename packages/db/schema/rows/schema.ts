import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  customType,
  jsonb,
} from "drizzle-orm/pg-core";
import type { Geometry } from "geojson";
import type { DocumentContent } from "@mapform/blocknote";
import { projects } from "../projects/schema";

const geometry = customType<{
  data: Geometry;
}>({
  dataType() {
    return "geometry";
  },
});

export const rows = pgTable("row", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  description: jsonb("description").$type<{ content: DocumentContent }>(),
  icon: varchar("icon", { length: 256 }),
  geometry: geometry("geometry"),

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
});
