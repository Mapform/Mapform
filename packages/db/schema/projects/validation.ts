import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { projects } from "./schema";

export const insertProjectSchema = createInsertSchema(projects);

export const selectProjectSchema = createSelectSchema(projects);

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
