import { relations } from "drizzle-orm";
import { datasets } from "../datasets/schema";
import { pages } from "../pages/schema";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  pages: many(pages),
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  childProjects: many(projects, {
    relationName: "child_to_root",
  }),
  pagesDataset: one(datasets, {
    fields: [projects.pagesDatasetId],
    references: [datasets.id],
  }),
  submissionsDataset: one(datasets, {
    fields: [projects.submissionsDatasetId],
    references: [datasets.id],
  }),
}));
