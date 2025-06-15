import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { layers, lineLayers, pointLayers, polygonLayers } from "./schema";

/**
 * LAYERS
 */
export const insertLayerSchema = createInsertSchema(layers, {
  // Must be a hex code
  color: z.string().length(7).regex(/^#/).optional(),
});

export const selectLayerSchema = createSelectSchema(layers, {
  // Must be a hex code
  color: z.string().length(7).regex(/^#/).optional(),
});

export type InsertLayer = z.infer<typeof insertLayerSchema>;
export type Layer = typeof layers.$inferSelect;

/**
 * POINT LAYERS
 */
export const insertPointLayerSchema = createInsertSchema(pointLayers);
export const selectPointLayerSchema = createSelectSchema(pointLayers);

export type InsertPointLayer = z.infer<typeof insertPointLayerSchema>;
export type PointLayer = typeof pointLayers.$inferSelect;

/**
 * LINE LAYERS
 */
export const insertLineLayerSchema = createInsertSchema(lineLayers);
export const selectLineLayerSchema = createSelectSchema(lineLayers);

export type InsertLineLayer = z.infer<typeof insertLineLayerSchema>;
export type LineLayer = typeof lineLayers.$inferSelect;

/**
 * POLYGON LAYERS
 */
export const insertPolygonLayerSchema = createInsertSchema(polygonLayers);
export const selectPolygonLayerSchema = createSelectSchema(polygonLayers);

export type InsertPolygonLayer = z.infer<typeof insertPolygonLayerSchema>;
export type PolygonLayer = typeof polygonLayers.$inferSelect;
