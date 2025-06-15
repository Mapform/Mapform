import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { layersToPages } from "./schema";

export const insertLayersToPagesSchema = createInsertSchema(layersToPages);

export const selectLayersToPagesSchema = createSelectSchema(layersToPages);

export type InsertLayersToPages = z.infer<typeof insertLayersToPagesSchema>;
export type LayersToPages = typeof layersToPages.$inferSelect;
