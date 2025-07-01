import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { fileTreePositions } from "./schema";

/**
 * Columns
 */
export const insertFileTreePositionSchema =
  createInsertSchema(fileTreePositions);

export const selectFileTreePositionSchema =
  createSelectSchema(fileTreePositions);

export type InsertFileTreePosition = z.infer<
  typeof insertFileTreePositionSchema
>;
export type FileTreePosition = typeof fileTreePositions.$inferSelect;
