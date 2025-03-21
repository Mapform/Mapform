import { relations } from "drizzle-orm";
import { blobs } from "./schema";
import { workspaces } from "../workspaces/schema";

export const blobsRelations = relations(blobs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [blobs.workspaceId],
    references: [workspaces.id],
  }),
}));
