import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { messages } from "./schema";

export const insertMessageSchema = createInsertSchema(messages);

export const selectMessageSchema = createSelectSchema(messages);

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
