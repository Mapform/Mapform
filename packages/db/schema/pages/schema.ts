import {
  smallint,
  pgEnum,
  timestamp,
  pgTable,
  uuid,
  geometry,
  text,
  real,
  doublePrecision,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "../projects";

export const contentViewTypeEnum = pgEnum("content_view_type", [
  "map",
  "split",
  "text",
]);

export const contentSideEnum = pgEnum("content_side", ["left", "right"]);

export const pages = pgTable("page", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),

  bannerImage: text("banner_image"),
  icon: varchar("icon", { length: 256 }),
  title: text("title"),
  content: jsonb("content"),

  zoom: doublePrecision("zoom").notNull(),
  pitch: real("pitch").notNull(),
  bearing: real("bearing").notNull(),
  center: geometry("center", { type: "point", mode: "xy" }).notNull(),
  position: smallint("position").notNull(),

  contentViewType: contentViewTypeEnum("content_view_type")
    .default("split")
    .notNull(),
  contentSide: contentSideEnum("content_side").default("left").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const pagesRelations = relations(pages, ({ one }) => ({
  project: one(projects, {
    fields: [pages.projectId],
    references: [projects.id],
  }),
}));
