import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { folders } from "./schema";

/**
 * Columns
 */
export const insertFolderSchema = createInsertSchema(folders);

export const selectFolderSchema = createSelectSchema(folders);

export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type Folder = typeof folders.$inferSelect;
