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
  index,
} from "drizzle-orm/pg-core";
import type { DocumentContent } from "@mapform/blocknote";
import { projects } from "../projects/schema";

export const contentViewTypeEnum = pgEnum("content_view_type", [
  "map",
  "split",
  "text",
]);

export const contentSideEnum = pgEnum("content_side", ["left", "right"]);

export const pages = pgTable(
  "page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),

    bannerImage: text("banner_image"),
    icon: varchar("icon", { length: 256 }),
    title: text("title"),
    content: jsonb("content").$type<{ content: DocumentContent }>(),

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
  },
  (t) => [index("page_spatial_index").using("gist", t.center)],
);
