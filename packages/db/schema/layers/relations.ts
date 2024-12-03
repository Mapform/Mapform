import { relations } from "drizzle-orm";
import { datasets } from "../datasets/schema";
import { layersToPages } from "../layers-to-pages/schema";
import { columns } from "../columns/schema";
import { layers, markerLayers, pointLayers } from "./schema";

/**
 * PARENT LAYER
 */
export const layersRelations = relations(layers, ({ one, many }) => ({
  dataset: one(datasets, {
    fields: [layers.datasetId],
    references: [datasets.id],
  }),
  layersToPages: many(layersToPages),
  pointLayer: one(pointLayers),
  markerLayer: one(markerLayers),
}));

/**
 * POINT LAYER
 */
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

/**
 * MARKER LAYER
 */
export const markerLayersRelations = relations(markerLayers, ({ one }) => ({
  layer: one(layers, {
    fields: [markerLayers.layerId],
    references: [layers.id],
  }),
  pointColumn: one(columns, {
    fields: [markerLayers.pointColumnId],
    references: [columns.id],
  }),
}));
