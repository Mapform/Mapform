import { relations } from "drizzle-orm";
import { datasets } from "../datasets/schema";
import { layersToPages } from "../layers-to-pages/schema";
import { columns } from "../columns/schema";
import {
  layers,
  pointLayers,
  lineLayers,
  polygonLayers,
  directionLayers,
} from "./schema";

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
  lineLayer: one(lineLayers),
  polygonLayer: one(polygonLayers),
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
 * LINE LAYER
 */
export const lineLayersRelations = relations(lineLayers, ({ one }) => ({
  layer: one(layers, {
    fields: [lineLayers.layerId],
    references: [layers.id],
  }),
  lineColumn: one(columns, {
    fields: [lineLayers.lineColumnId],
    references: [columns.id],
  }),
}));

/**
 * DIRECTION LAYER
 */
export const directionLayersRelations = relations(
  directionLayers,
  ({ one }) => ({
    layer: one(layers, {
      fields: [directionLayers.layerId],
      references: [layers.id],
    }),
    directionColumn: one(columns, {
      fields: [directionLayers.lineColumnId],
      references: [columns.id],
    }),
  }),
);
/**
 * POLYGON LAYER
 */
export const polygonLayersRelations = relations(polygonLayers, ({ one }) => ({
  layer: one(layers, {
    fields: [polygonLayers.layerId],
    references: [layers.id],
  }),
  polygonColumn: one(columns, {
    fields: [polygonLayers.polygonColumnId],
    references: [columns.id],
  }),
}));
