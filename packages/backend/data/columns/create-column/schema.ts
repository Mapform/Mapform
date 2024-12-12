import type { z } from "zod";
import { insertColumnSchema } from "@mapform/db/schema";

export const createColumnSchema = insertColumnSchema;

export type CreateColumnSchema = z.infer<typeof createColumnSchema>;
