import { relations } from "drizzle-orm";
import { layersToPages } from "../layers-to-pages/schema";
import { projects } from "../projects/schema";
import { pages } from "./schema";

export const pagesRelations = relations(pages, ({ one, many }) => ({
  project: one(projects, {
    fields: [pages.projectId],
    references: [projects.id],
  }),
  layersToPages: many(layersToPages),
}));
