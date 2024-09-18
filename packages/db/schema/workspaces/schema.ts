import { timestamp, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "../../utils";
import { workspaceMemberships } from "../workspace-memberships";

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

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  workspaceMemberships: many(workspaceMemberships),
}));
