import { timestamp, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspace", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
