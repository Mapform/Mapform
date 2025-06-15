import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { datasets } from "./schema";

/**
 * Datasets
 */
export const insertDatasetSchema = createInsertSchema(datasets, {
  name: (schema) => schema.name.min(3),
});

export const selectDatasetSchema = createSelectSchema(datasets);

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;
