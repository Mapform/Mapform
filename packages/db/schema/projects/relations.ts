import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";
import { mapViews } from "../map-view/schema";
import { tableViews } from "../table-view/schema";

export const projectsRelations = relations(projects, ({ one }) => ({
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  tableView: one(tableViews),
  mapView: one(mapViews),
}));
