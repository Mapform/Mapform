import { pgTable, uuid, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { chats } from "../chats/schema";

export const messages = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chats.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
