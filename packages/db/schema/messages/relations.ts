import { relations } from "drizzle-orm";
import { messages } from "./schema";
import { chats } from "../chats/schema";

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
