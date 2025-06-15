import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { properties } from "./schema";

/**
 * Columns
 */
export const insertPropertySchema = createInsertSchema(properties, {
  name: (schema) => schema.name.min(3),
});

export const selectPropertySchema = createSelectSchema(properties);

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
