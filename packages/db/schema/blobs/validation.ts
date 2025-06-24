import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { blobs } from "./schema";

/**
 * Images
 */
export const insertBlobSchema = createInsertSchema(blobs);

export const selectBlobSchema = createSelectSchema(blobs);

export type InsertBlob = z.infer<typeof insertBlobSchema>;
export type Blob = typeof blobs.$inferSelect;
