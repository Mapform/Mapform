import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { layers, pointLayers } from "./schema";

/**
 * LAYERS
 */
export const insertLayerSchema = createInsertSchema(layers, {
  name: (schema) => schema.name.min(3),
});

export const selectLayerSchema = createSelectSchema(layers);

export type InsertLayer = z.infer<typeof insertLayerSchema>;
export type Layer = typeof layers.$inferSelect;

/**
 * POINT LAYERS
 */
export const insertPointLayerSchema = createInsertSchema(pointLayers, {
  // Must be a hex code
  color: z.string().length(7).regex(/^#/).optional(),
});
export const selectPointLayerSchema = createSelectSchema(pointLayers, {
  // Must be a hex code
  color: z.string().length(7).regex(/^#/).optional(),
});

export type InsertPointLayer = z.infer<typeof insertPointLayerSchema>;
export type PointLayer = typeof pointLayers.$inferSelect;
