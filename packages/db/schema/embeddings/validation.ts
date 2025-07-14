import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { embeddings } from "./schema";

export const insertEmbeddingSchema = createInsertSchema(embeddings);

export const selectEmbeddingSchema = createSelectSchema(embeddings);

export type InsertEmbedding = z.infer<typeof insertEmbeddingSchema>;
export type Embedding = typeof embeddings.$inferSelect;
