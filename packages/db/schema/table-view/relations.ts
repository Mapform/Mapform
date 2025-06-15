import { relations } from "drizzle-orm";
import { tableViews } from "./schema";
import { projects } from "../projects/schema";

export const tableViewsRelations = relations(tableViews, ({ one }) => ({
  project: one(projects, {
    fields: [tableViews.projectId],
    references: [projects.id],
  }),
}));
