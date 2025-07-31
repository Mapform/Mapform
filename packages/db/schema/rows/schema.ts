import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  customType,
  jsonb,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";
import type { Geometry } from "geojson";
import type { CustomBlock } from "@mapform/blocknote";

// Also export Point type for convenience
export type PointType = { type: "Point"; coordinates: [number, number] };

// Type for cover photo with TASL metadata
export type CoverPhoto = {
  url: string;
  title?: string;
  author?: string;
  source?: string;
  license?: string;
};

const geometry = customType<{
  data: Geometry;
}>({
  dataType() {
    return "geometry";
  },
});

export const rows = pgTable("row", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  description: jsonb("description").$type<CustomBlock[]>(),
  icon: varchar("icon", { length: 256 }),
  coverPhotos: jsonb("cover_photos").$type<CoverPhoto[]>(),
  // Only allow hex colors
  color: varchar("color", { length: 7 }).$type<`#${string}`>(),
  geometry: geometry("geometry"),

  // Optional geoapify place id. Used when storing places from geoapify.
  geoapifyPlaceId: varchar("geoapify_place_id", { length: 256 }),

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
