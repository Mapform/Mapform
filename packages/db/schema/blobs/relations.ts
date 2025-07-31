import { relations } from "drizzle-orm";
import { blobs } from "./schema";
import { workspaces } from "../workspaces/schema";
import { projects } from "../projects/schema";
import { rows } from "../rows/schema";

export const blobsRelations = relations(blobs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [blobs.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [blobs.projectId],
    references: [projects.id],
  }),
  row: one(rows, {
    fields: [blobs.rowId],
    references: [rows.id],
  }),
}));
