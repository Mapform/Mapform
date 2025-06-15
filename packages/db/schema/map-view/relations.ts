import { relations } from "drizzle-orm";
import { mapViews } from "./schema";
import { projects } from "../projects/schema";

export const mapViewsRelations = relations(mapViews, ({ one }) => ({
  project: one(projects, {
    fields: [mapViews.projectId],
    references: [projects.id],
  }),
}));
