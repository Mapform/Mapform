import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { plans } from "./schema";

/**
 * Plans
 */
export const insertPlanSchema = createInsertSchema(plans);
export const selectPlanSchema = createSelectSchema(plans);

export type InsertPlan = z.infer<typeof selectPlanSchema>;
export type Plan = typeof plans.$inferSelect;
