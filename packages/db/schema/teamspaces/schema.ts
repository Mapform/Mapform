import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teamspaceMemberships } from "../teamspace-memberships";
import { workspaces } from "../workspaces";
import { projects } from "../projects";
import { datasets } from "../datasets";

export const teamspaces = pgTable(
  "teamspace",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.workspaceId, t.slug),
  })
);

export const teamspacesRelations = relations(teamspaces, ({ one, many }) => ({
  projects: many(projects),
  datasets: many(datasets),
  teamspaceMemberships: many(teamspaceMemberships),
  workspace: one(workspaces, {
    fields: [teamspaces.workspaceId],
    references: [workspaces.id],
  }),
}));
