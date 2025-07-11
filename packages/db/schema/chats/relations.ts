import { relations } from "drizzle-orm";
import { chats } from "./schema";
import { users } from "../users/schema";
import { messages } from "../messages/schema";
import { projects } from "../projects/schema";

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [chats.projectId],
    references: [projects.id],
  }),
  messages: many(messages),
}));
