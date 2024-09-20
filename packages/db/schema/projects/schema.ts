import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces";
import { pages } from "../pages";

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  icon: varchar("icon", { length: 256 }),

  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id),
  isDirty: boolean("is_dirty").default(false).notNull(),

  // This is NULL for the root project
  rootProjectId: uuid("root_project_id"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  pages: many(pages),
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  rootProject: one(projects, {
    fields: [projects.rootProjectId],
    references: [projects.id],
    relationName: "child_to_root",
  }),
  childProjects: many(projects, {
    relationName: "child_to_root",
  }),
}));
