import { relations } from "drizzle-orm";
import { properties } from "./schema";
import { projects } from "../projects/schema";

export const propertiesRelations = relations(properties, ({ one }) => ({
  project: one(projects, {
    fields: [properties.projectId],
    references: [projects.id],
  }),
}));
