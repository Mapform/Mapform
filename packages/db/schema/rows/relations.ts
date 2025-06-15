import { relations } from "drizzle-orm";
import { rows } from "./schema";
import { projects } from "../projects/schema";
import { cells } from "../cells/schema";

export const rowsRelations = relations(rows, ({ one, many }) => ({
  project: one(projects, {
    fields: [rows.projectId],
    references: [projects.id],
  }),
  cells: many(cells),
}));
