import { timestamp, pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "../../utils";
import { teamspaceMemberships } from "../teamspace-memberships";
import { workspaces } from "../workspaces";

export const teamspaces = pgTable("teamspace", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  imageUrl: text("imageUri"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const teamspacesRelations = relations(teamspaces, ({ one, many }) => ({
  teamspaceMemberships: many(teamspaceMemberships),
  workspace: one(workspaces, {
    fields: [teamspaces.workspaceId],
    references: [workspaces.id],
  }),
}));
