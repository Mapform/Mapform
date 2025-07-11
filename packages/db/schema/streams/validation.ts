import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { streams } from "./schema";

export const insertStreamSchema = createInsertSchema(streams);

export const selectStreamSchema = createSelectSchema(streams);

export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;
