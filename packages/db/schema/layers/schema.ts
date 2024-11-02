import { timestamp, pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { datasets } from "../datasets";
import { layersToPages } from "../layers-to-pages";
import { columns } from "../columns";

export const layerTypeEnum = pgEnum("layer_type", ["point"]);

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

export const layersRelations = relations(layers, ({ one, many }) => ({
  dataset: one(datasets, {
    fields: [layers.datasetId],
    references: [datasets.id],
  }),
  layersToPages: many(layersToPages),
  pointLayer: one(pointLayers),
}));

/**
 * POINT LAYER
 */
export const pointLayers = pgTable("point_layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  layerId: uuid("layer_id")
    .notNull()
    .references(() => layers.id),
  pointColumnId: uuid("point_column_id")
    .notNull()
    .references(() => columns.id),
  titleColumnId: uuid("title_column_id")
    .notNull()
    .references(() => columns.id),
  descriptionColumnId: uuid("description_column_id")
    .notNull()
    .references(() => columns.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const pointLayersRelations = relations(pointLayers, ({ one }) => ({
  layer: one(layers, {
    fields: [pointLayers.layerId],
    references: [layers.id],
  }),
  pointColumn: one(columns, {
    fields: [pointLayers.pointColumnId],
    references: [columns.id],
  }),
}));
