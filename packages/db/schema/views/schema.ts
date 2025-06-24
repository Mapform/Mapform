import {
  timestamp,
  pgTable,
  uuid,
  pgEnum,
  text,
  unique,
  smallint,
  geometry,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";

export const viewTypes = pgEnum("view_type", ["table", "map"]);

/**
 * PARENT VIEW
 */
export const views = pgTable("view", {
  id: uuid("id").primaryKey().defaultRandom(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  type: viewTypes("type").notNull(),

  name: text("name"),

  position: smallint("position").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * TABLE VIEW
 */
export const tableViews = pgTable(
  "table_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    viewId: uuid("view_id")
      .notNull()
      .references(() => views.id, { onDelete: "cascade" }),
  },
  (t) => [unique("table_view_unq").on(t.viewId)],
);

/**
 * MAP VIEW
 */
export const mapViews = pgTable(
  "map_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    center: geometry("center", {
      type: "point",
      mode: "tuple",
      srid: 4326,
    }).notNull(),

    viewId: uuid("view_id")
      .notNull()
      .references(() => views.id, { onDelete: "cascade" }),
  },
  (t) => [unique("map_view_unq").on(t.viewId)],
);
