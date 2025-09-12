import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { chats } from "../chats/schema";

export const streams = pgTable(
  "stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chats.id],
    }),
  }),
);
