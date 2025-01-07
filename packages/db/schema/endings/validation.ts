import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { endings } from "./schema";

/**
 * Endings
 */
export const insertEndingSchema = createInsertSchema(endings);

export const selectEndingSchema = createSelectSchema(endings);

export type InsertEnding = z.infer<typeof insertEndingSchema>;
export type Ending = typeof endings.$inferSelect;
