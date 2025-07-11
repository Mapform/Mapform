import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { users } from "../users/schema";
import { projects } from "../projects/schema";

export const chats = pgTable("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
