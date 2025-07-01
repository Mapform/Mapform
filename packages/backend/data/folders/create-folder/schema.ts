import { z } from "zod";
import { insertFolderSchema } from "@mapform/db/schema";

export const createFolderSchema = z.object({
  teamspaceId: insertFolderSchema.shape.teamspaceId,
  folderId: insertFolderSchema.shape.parentId,
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;
