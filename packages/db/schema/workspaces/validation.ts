import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { workspaces } from "./schema";

export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  name: (schema) => schema.name.min(3).max(256),
  slug: (schema) =>
    schema.slug
      .min(3)
      .max(256)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
});

export const selectWorkspaceSchema = createSelectSchema(workspaces, {
  name: (schema) => schema.name.min(3).max(256),
  slug: (schema) =>
    schema.slug
      .min(3)
      .max(256)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
});

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;
