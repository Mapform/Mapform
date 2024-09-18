import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { workspaces } from "./schema";

export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  name: (schema) => schema.name.min(3),
});

export const selectWorkspaceSchema = createSelectSchema(workspaces);

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = z.infer<typeof selectWorkspaceSchema>;
