import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspace", {
  id: text("id").primaryKey(),
  slug: varchar("name", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  imageUrl: text("imageUri"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
