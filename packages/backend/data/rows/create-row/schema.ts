import type { z } from "zod/v4";
import { insertRowSchema } from "@mapform/db/schema";

export const createRowSchema = insertRowSchema;

export type CreateRowSchema = z.infer<typeof createRowSchema>;
