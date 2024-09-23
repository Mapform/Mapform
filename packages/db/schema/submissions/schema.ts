import { timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rows } from "../rows";
import { projects } from "../projects";

export const submissions = pgTable("submission", {
  id: uuid("id").primaryKey().defaultRandom(),

  /**
   * The id of the PUBLISHED project. Should not create submissions for unpublished projects.
   */
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  rowId: uuid("row_id")
    .notNull()
    .references(() => rows.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  project: one(projects, {
    fields: [submissions.projectId],
    references: [projects.id],
  }),
  row: one(rows, {
    fields: [submissions.rowId],
    references: [rows.id],
  }),
}));
