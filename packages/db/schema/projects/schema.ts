import { timestamp, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "../../utils";
import { teamspaces } from "../teamspaces";

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
}));
