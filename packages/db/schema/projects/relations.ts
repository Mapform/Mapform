import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";
import { mapViews } from "../map-view/schema";
import { tableViews } from "../table-view/schema";
import { rows } from "../rows/schema";
import { columns } from "../columns/schema";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  tableView: one(tableViews),
  mapView: one(mapViews),
  rows: many(rows),
  columns: many(columns),
}));
