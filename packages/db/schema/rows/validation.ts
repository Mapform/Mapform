import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { rows } from "./schema";

/**
 * Rows
 */
export const insertRowSchema = createInsertSchema(rows);

export const selectRowSchema = createSelectSchema(rows);

export type InsertRow = z.infer<typeof insertRowSchema>;
export type Row = typeof rows.$inferSelect;
