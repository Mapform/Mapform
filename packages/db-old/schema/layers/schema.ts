import { timestamp, pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { datasets } from "../datasets/schema";
import { columns } from "../columns/schema";

export const layerTypeEnum = pgEnum("layer_type", ["point", "line", "polygon"]);

/**
 * PARENT LAYER
 */
export const layers = pgTable("layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  type: layerTypeEnum("type").notNull(),

  // All layers will share the same title, description, icon columns, color
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

  // TODO: Remove this once we have a way to handle the datasetId for line and polygon layers
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
    .unique()
    .notNull()
    .references(() => layers.id, { onDelete: "cascade" }),
  pointColumnId: uuid("point_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const lineLayers = pgTable("line_layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  layerId: uuid("layer_id")
    .unique()
    .notNull()
    .references(() => layers.id, { onDelete: "cascade" }),
  lineColumnId: uuid("line_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const polygonLayers = pgTable("polygon_layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  layerId: uuid("layer_id")
    .unique()
    .notNull()
    .references(() => layers.id, { onDelete: "cascade" }),
  polygonColumnId: uuid("polygon_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
