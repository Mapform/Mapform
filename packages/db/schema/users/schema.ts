import {
  boolean,
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  email: text("email").unique().notNull(),
  image: text("image"),
  hasOnboarded: boolean("hasOnboarded").notNull().default(false),

  // guides
  workspaceGuideCompleted: boolean("workspaceGuideCompleted")
    .notNull()
    .default(false),
  projectGuideCompleted: boolean("projectGuideCompleted")
    .notNull()
    .default(false),
});

export const magicLinks = pgTable("magic_link", {
  token: text("token").notNull().primaryKey(),
  email: text("email").notNull(),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});
