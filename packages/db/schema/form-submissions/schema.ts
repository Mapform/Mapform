import { timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { rows } from "../rows/schema";
import { projects } from "../projects/schema";

export const formSubmissions = pgTable("form_submission", {
  id: uuid("id").primaryKey().defaultRandom(),
  rowId: uuid("row_id")
    .notNull()
    .references(() => rows.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  submittedAt: timestamp("submitted_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
