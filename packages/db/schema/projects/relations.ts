import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";

export const projectsRelations = relations(projects, ({ one }) => ({
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
}));
