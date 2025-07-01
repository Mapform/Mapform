import { z } from "zod";
import { insertFolderSchema } from "@mapform/db/schema";

export const createFolderSchema = z.object({
  teamspaceId: insertFolderSchema.shape.teamspaceId,
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;
