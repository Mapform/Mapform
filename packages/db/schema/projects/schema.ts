import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  boolean,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";
import { datasets } from "../datasets/schema";

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  icon: varchar("icon", { length: 256 }),

  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id, { onDelete: "cascade" }),
  isDirty: boolean("is_dirty").default(false).notNull(),

  // This is NULL for the root project
  rootProjectId: uuid("root_project_id").references(
    (): AnyPgColumn => projects.id,
    {
      onDelete: "cascade",
    },
  ),
  datasetId: uuid("dataset_id").references(() => datasets.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
