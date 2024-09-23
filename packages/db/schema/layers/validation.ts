import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { layers } from "./schema";

export const insertLayerSchema = createInsertSchema(layers, {
  name: (schema) => schema.name.min(3),
});

export const selectLayerSchema = createSelectSchema(layers);

export type InsertLayer = z.infer<typeof insertLayerSchema>;
export type Layer = typeof layers.$inferSelect;
