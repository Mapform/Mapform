import { timestamp, pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { datasets } from "../datasets/schema";
import { columns } from "../columns/schema";

export const layerTypeEnum = pgEnum("layer_type", ["point", "marker"]);
export const colorEnum = pgEnum("color", ["black", "gray", ""]);

/**
 * PARENT LAYER
 */
export const layers = pgTable("layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  type: layerTypeEnum("type").notNull(),
  datasetId: uuid("dataset_id")
    .notNull()
    .references(() => datasets.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * POINT LAYER
 */
export const pointLayers = pgTable("point_layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  layerId: uuid("layer_id")
    .notNull()
    .references(() => layers.id, { onDelete: "cascade" }),
  pointColumnId: uuid("point_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  titleColumnId: uuid("title_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  descriptionColumnId: uuid("description_column_id").references(
    () => columns.id,
    { onDelete: "set null" },
  ),
  color: text("color"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * MARKER LAYER
 */
export const markerLayers = pgTable("marker_layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  layerId: uuid("layer_id")
    .notNull()
    .references(() => layers.id, { onDelete: "cascade" }),
  pointColumnId: uuid("point_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  titleColumnId: uuid("title_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  descriptionColumnId: uuid("description_column_id").references(
    () => columns.id,
    { onDelete: "set null" },
  ),
  iconColumnId: uuid("icon_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  color: text("color"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
