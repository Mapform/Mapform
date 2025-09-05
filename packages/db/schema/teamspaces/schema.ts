import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { workspaces } from "../workspaces/schema";
import { users } from "../users/schema";

export const teamspaces = pgTable(
  "teamspace",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    isPrivate: boolean("is_private").notNull().default(false),
    ownerUserId: uuid("owner_user_id")
      .references(() => users.id, {
        onDelete: "set null",
      })
      .notNull(),
    workspaceSlug: varchar("workspace_slug")
      .notNull()
      .references(() => workspaces.slug, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    unique().on(t.workspaceSlug, t.slug),
    // Each user gets one private teamspace per workspace
    sql`unique (workspace_slug, owner_user_id) where is_private = true`,
  ],
);
