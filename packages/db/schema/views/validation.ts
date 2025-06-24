import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { views } from "./schema";

export const insertViewSchema = createInsertSchema(views);

export const selectViewSchema = createSelectSchema(views);

export type InsertView = z.infer<typeof insertViewSchema>;
export type View = typeof views.$inferSelect;
