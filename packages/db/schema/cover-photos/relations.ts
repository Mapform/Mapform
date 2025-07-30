import { relations } from "drizzle-orm";
import { coverPhotos } from "./schema";
import { projects } from "../projects/schema";
import { rows } from "../rows/schema";
import { blobs } from "../blobs/schema";

export const coverPhotosRelations = relations(coverPhotos, ({ one }) => ({
  project: one(projects, {
    fields: [coverPhotos.projectId],
    references: [projects.id],
  }),
  row: one(rows, {
    fields: [coverPhotos.rowId],
    references: [rows.id],
  }),
  blob: one(blobs, {
    fields: [coverPhotos.blobId],
    references: [blobs.id],
  }),
}));
