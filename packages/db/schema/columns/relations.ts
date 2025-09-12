import { relations } from "drizzle-orm";
import { columns } from "./schema";
import { projects } from "../projects/schema";

export const columnsRelations = relations(columns, ({ one }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
}));
