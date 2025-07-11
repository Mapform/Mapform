import { relations } from "drizzle-orm";
import { streams } from "./schema";
import { chats } from "../chats/schema";

export const streamsRelations = relations(streams, ({ one }) => ({
  chat: one(chats, {
    fields: [streams.chatId],
    references: [chats.id],
  }),
}));
