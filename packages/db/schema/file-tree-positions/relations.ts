import { relations } from "drizzle-orm";
import { fileTreePositions } from "./schema";
import { teamspaces } from "../teamspaces/schema";
import { folders } from "../folders/schema";

export const fileTreePositionsRelations = relations(
  fileTreePositions,
  ({ one, many }) => ({
    teamspace: one(teamspaces, {
      fields: [fileTreePositions.teamspaceId],
      references: [teamspaces.id],
    }),
    parent: one(folders, {
      fields: [fileTreePositions.parentId],
      references: [folders.id],
    }),
    children: many(fileTreePositions),
  }),
);
