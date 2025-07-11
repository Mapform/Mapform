import { uuid, index, pgTable, text, vector } from "drizzle-orm/pg-core";
import { rows } from "../rows/schema";

export const embeddings = pgTable(
  "embedding",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rowId: uuid("row_id")
      .notNull()
      .references(() => rows.id, {
        onDelete: "cascade",
      }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
