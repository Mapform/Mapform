import { z } from "zod";
import {
  insertFolderSchema,
  selectFileTreePositionSchema,
} from "@mapform/db/schema";

export const createFolderSchema = z.object({
  teamspaceId: insertFolderSchema.shape.teamspaceId,
  parentId: selectFileTreePositionSchema.shape.parentId.optional(),
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;
