import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { workspaceMemberships } from "../workspace-memberships";
import { teamspaceMemberships } from "../teamspace-memberships";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  email: text("email").unique().notNull(),
  image: text("image"),
  hasOnboarded: boolean("hasOnboarded").notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMemberships: many(workspaceMemberships),
  teamspaceMemberships: many(teamspaceMemberships),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});
