import { uuid } from "drizzle-orm/pg-core";

import { timestamp } from "drizzle-orm/pg-core";

import { pgTable } from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";

/**
 * PARENT CELL
 */
export const tableViews = pgTable("table_view", {
  id: uuid("id").primaryKey().defaultRandom(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
