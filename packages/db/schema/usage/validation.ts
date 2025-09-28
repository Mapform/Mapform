import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { aiTokenUsage } from "./schema";

export const insertAiTokenUsageSchema = createInsertSchema(aiTokenUsage);
export const selectAiTokenUsageSchema = createSelectSchema(aiTokenUsage);

export type InsertAiTokenUsage = z.infer<typeof insertAiTokenUsageSchema>;
export type AiTokenUsage = typeof aiTokenUsage.$inferSelect;

