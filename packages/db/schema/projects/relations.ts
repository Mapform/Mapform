import { relations } from "drizzle-orm";
import { datasets } from "../datasets/schema";
import { pages } from "../pages/schema";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";
import { endings } from "../endings/schema";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  pages: many(pages),
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  rootProject: one(projects, {
    fields: [projects.rootProjectId],
    references: [projects.id],
    relationName: "child_to_root",
  }),
  childProjects: many(projects, {
    relationName: "child_to_root",
  }),
  submissionsDataset: one(datasets, {
    fields: [projects.datasetId],
    references: [datasets.id],
  }),
  ending: one(endings),
}));
