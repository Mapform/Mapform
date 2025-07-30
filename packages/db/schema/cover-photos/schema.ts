import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";
import { rows } from "../rows/schema";
import { blobs } from "../blobs/schema";

export const coverPhotos = pgTable("cover_photo", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Reference to the project this cover photo belongs to (optional)
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),

  // Reference to the row this cover photo belongs to (optional)
  rowId: uuid("row_id").references(() => rows.id, { onDelete: "cascade" }),

  // Reference to the blob (1-to-1 relationship)
  blobId: uuid("blob_id")
    .notNull()
    .unique()
    .references(() => blobs.id, { onDelete: "cascade" }),

  // Optional metadata for cover photos
  title: varchar("title", { length: 256 }),
  author: varchar("author", { length: 256 }),
  source: varchar("source", { length: 512 }),
  license: varchar("license", { length: 256 }),

  // Order of cover photos within the project or row
  position: integer("position").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
