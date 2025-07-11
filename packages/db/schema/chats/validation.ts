import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { chats } from "./schema";

export const insertChatSchema = createInsertSchema(chats);

export const selectChatSchema = createSelectSchema(chats);

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;
