import type { z } from "zod";
import { insertProjectSchema } from "@mapform/db/schema";

export const createProjectSchema = insertProjectSchema;

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
