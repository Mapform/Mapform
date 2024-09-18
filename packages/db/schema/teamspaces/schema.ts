import { timestamp, pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "../../utils";
import { teamspaceMemberships } from "../teamspace-memberships";

export const teamspaces = pgTable("teamspace", {
  id: uuid("id").primaryKey().defaultRandom(),
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

export const teamspacesRelations = relations(teamspaces, ({ many }) => ({
  teamspaceMemberships: many(teamspaceMemberships),
}));
