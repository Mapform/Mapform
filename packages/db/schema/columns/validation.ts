import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { columns } from "./schema";

/**
 * Columns
 */
export const insertColumnSchema = createInsertSchema(columns, {
  name: (schema) => schema.min(3),
});

export const selectColumnSchema = createSelectSchema(columns);

export type InsertColumn = z.infer<typeof insertColumnSchema>;
export type Column = typeof columns.$inferSelect;
