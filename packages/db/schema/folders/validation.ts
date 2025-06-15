import { z } from "zod";
import { folders } from "./schema";

export const folderSchema = z.object({
  name: z.string().min(1).max(256),
  description: z.string().max(512).optional(),
  icon: z.string().max(256).optional(),
  parentId: z.string().uuid().optional(),
  teamspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  order: z.string().default("0"),
});

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
