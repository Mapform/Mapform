import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { z } from "zod";
import { rows } from "./schema";

/**
 * Rows
 */
export const insertRowSchema = createInsertSchema(rows);

export const selectRowSchema = createSelectSchema(rows);

export const updateRowSchema = createUpdateSchema(rows);

export type InsertRow = z.infer<typeof insertRowSchema>;
export type Row = typeof rows.$inferSelect;
