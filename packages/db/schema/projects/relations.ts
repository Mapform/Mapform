import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "./schema";
import { rows } from "../rows/schema";
import { columns } from "../columns/schema";
import { views } from "../views/schema";
import { folders } from "../folders/schema";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  teamspace: one(teamspaces, {
    fields: [projects.teamspaceId],
    references: [teamspaces.id],
  }),
  rows: many(rows),
  columns: many(columns),
  views: many(views),
  folder: one(folders),
}));
