import type { z } from "zod/v4";
import { insertColumnSchema } from "@mapform/db/schema";

export const createColumnSchema = insertColumnSchema;

export type CreateColumnSchema = z.infer<typeof createColumnSchema>;
