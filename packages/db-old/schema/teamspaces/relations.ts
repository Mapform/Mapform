import { relations } from "drizzle-orm";
import { teamspaceMemberships } from "../teamspace-memberships/schema";
import { projects } from "../projects/schema";
import { workspaces } from "../workspaces/schema";
import { datasets } from "../datasets/schema";
import { teamspaces } from "./schema";

export const teamspacesRelations = relations(teamspaces, ({ one, many }) => ({
  projects: many(projects),
  datasets: many(datasets),
  teamspaceMemberships: many(teamspaceMemberships),
  workspace: one(workspaces, {
    fields: [teamspaces.workspaceSlug],
    references: [workspaces.slug],
  }),
}));
