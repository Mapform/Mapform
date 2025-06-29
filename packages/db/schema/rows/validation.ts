import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { blockSchema } from "@mapform/blocknote/validation";
import { rows } from "./schema";

const schemaExtension = {
  description: blockSchema.array(),
};

/**
 * Rows
 */
export const insertRowSchema = createInsertSchema(rows, schemaExtension);

export const selectRowSchema = createSelectSchema(rows, schemaExtension);

export const updateRowSchema = createUpdateSchema(rows, {
  id: z.string(),
  ...schemaExtension,
});

export type InsertRow = z.infer<typeof insertRowSchema>;
export type Row = typeof rows.$inferSelect;
