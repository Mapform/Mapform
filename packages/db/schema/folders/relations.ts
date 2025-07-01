import { relations } from "drizzle-orm";
import { folders } from "./schema";
import { teamspaces } from "../teamspaces/schema";
import { fileTreePositions } from "../file-tree-positions/schema";

export const foldersRelations = relations(folders, ({ one }) => ({
  teamspace: one(teamspaces, {
    fields: [folders.teamspaceId],
    references: [teamspaces.id],
  }),

  fileTreePosition: one(fileTreePositions, {
    fields: [folders.fileTreePositionId],
    references: [fileTreePositions.id],
  }),
}));
