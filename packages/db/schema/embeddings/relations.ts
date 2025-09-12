import { relations } from "drizzle-orm";
import { embeddings } from "./schema";
import { rows } from "../rows/schema";

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  row: one(rows, {
    fields: [embeddings.rowId],
    references: [rows.id],
  }),
}));
