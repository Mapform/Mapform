import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { projects } from "./schema";

export const insertProjectSchema = createInsertSchema(projects, {
  name: (schema) => schema.name.min(3),
});

export const selectProjectSchema = createSelectSchema(projects);

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
