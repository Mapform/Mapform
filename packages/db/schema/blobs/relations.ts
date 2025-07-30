import { relations } from "drizzle-orm";
import { blobs } from "./schema";
import { workspaces } from "../workspaces/schema";
import { coverPhotos } from "../cover-photos/schema";

export const blobsRelations = relations(blobs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [blobs.workspaceId],
    references: [workspaces.id],
  }),
  coverPhoto: one(coverPhotos, {
    fields: [blobs.id],
    references: [coverPhotos.blobId],
  }),
}));
