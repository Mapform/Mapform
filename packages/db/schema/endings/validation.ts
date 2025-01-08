import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { endings } from "./schema";

const schemaExtension = {
  redirectUrl: z.string().url().optional(),
};

/**
 * Endings
 */
export const insertEndingSchema = createInsertSchema(endings, schemaExtension);
export const selectEndingSchema = createSelectSchema(endings, schemaExtension);

export type InsertEnding = z.infer<typeof insertEndingSchema>;
export type Ending = typeof endings.$inferSelect;
