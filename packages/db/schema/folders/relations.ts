import { relations } from "drizzle-orm";
import { folders } from "./schema";
import { teamspaces } from "../teamspaces/schema";
import { projects } from "../projects/schema";

export const foldersRelations = relations(folders, ({ one, many }) => ({
  // Self-referential relationship for parent-child folders
  parent: one(folders),
  children: many(folders),

  // Teamspace relationship
  teamspace: one(teamspaces, {
    fields: [folders.teamspaceId],
    references: [teamspaces.id],
  }),

  // Project relationship
  project: many(projects),
}));
