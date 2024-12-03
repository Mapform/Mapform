import { relations } from "drizzle-orm";
import { columns } from "../columns/schema";
import { layers } from "../layers/schema";
import { projects } from "../projects/schema";
import { rows } from "../rows/schema";
import { teamspaces } from "../teamspaces/schema";
import { datasets } from "./schema";

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  teamspace: one(teamspaces, {
    fields: [datasets.teamspaceId],
    references: [teamspaces.id],
  }),
  layers: many(layers),
  rows: many(rows),
  columns: many(columns),
  project: many(projects),
}));
