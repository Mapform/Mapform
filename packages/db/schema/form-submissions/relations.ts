import { relations } from "drizzle-orm";
import { formSubmissions } from "./schema";
import { rows } from "../rows/schema";
import { projects } from "../projects/schema";

export const formSubmissionsRelations = relations(
  formSubmissions,
  ({ one }) => ({
    row: one(rows, {
      fields: [formSubmissions.rowId],
      references: [rows.id],
    }),
    project: one(projects, {
      fields: [formSubmissions.projectId],
      references: [projects.id],
    }),
  }),
);
