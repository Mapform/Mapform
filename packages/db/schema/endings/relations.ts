import { relations } from "drizzle-orm";
import { projects } from "../projects/schema";
import { endings } from "./schema";

export const endingsRelations = relations(endings, ({ one }) => ({
  project: one(projects, {
    fields: [endings.projectId],
    references: [projects.id],
  }),
}));
