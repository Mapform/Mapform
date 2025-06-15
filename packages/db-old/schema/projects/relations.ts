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
  submissionsDataset: one(datasets, {
    fields: [projects.datasetId],
    references: [datasets.id],
  }),
}));
