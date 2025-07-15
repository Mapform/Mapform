import {
  uuid,
  index,
  pgTable,
  text,
  vector,
  timestamp,
} from "drizzle-orm/pg-core";
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
    contentHash: text("content_hash").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    contentHashIndex: index("content_hash_index").on(table.contentHash),
  }),
);
