import { timestamp, pgTable, varchar, uuid, unique } from "drizzle-orm/pg-core";
import { workspaces } from "../workspaces/schema";

export const teamspaces = pgTable(
  "teamspace",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    workspaceSlug: varchar("workspace_slug")
      .notNull()
      .references(() => workspaces.slug, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [unique().on(t.workspaceSlug, t.slug)],
);
